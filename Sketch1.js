// ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ
// Параметры графов
let graphRad = 300; // Радиус исходного графа
let vertRad = 40; // Радиус вершин

// Параметры страниц
let pages = []; // Массив страниц
let vertPerPage = 10; // Макс. кол-во вершин на странице
let pagesNum; // Кол-во страниц

// Исходные данные
let scrAdjList; // Список инцедентных вершин
let isReady = false;
let lineSum = 0;

// Макросы размеров холста
let WW;
let WH;

let drawCounter = 0;

// ПРОГРАММА
function setup() {
    // Макросы размеров холста
    WW = windowWidth;
    WH = windowHeight;

    // Основной Алгоритм
    fetch('AdjList')
        .then(response => response.text())
        .then(text => {
            // Чтение исходного графа из файла и определение размера
            scrAdjList = text.split('\n').map(str => str.split(' ').map(ch => parseInt(ch)))
            let vertNum = scrAdjList.length;

            // Подсчёт кол-ва страниц
            pagesNum = Math.floor(vertNum / vertPerPage) +
                Math.floor(vertNum / vertPerPage - Math.floor(vertNum / vertPerPage) + 1 - 1e-5);

            // Инициализация и заполнение исходной страницы
            pages.push(new Page(WW / 2 - 550, WH / 2 - 100, graphRad));
            console.log("Source Page after init", 0, pages[0].graph);
            for (let i = 0; i < vertNum; i++) {
                pages[0].graph.push(new Vert(i, scrAdjList[i]));
            }

            // Костыль (избавление от NaN)
            let kostN = pages[0].graph.length;
            pages[0].graph[kostN - 1].arr.pop();

            // Создание матрицы смежности
            let matrix = pages[0].adjMatrix();

            // Определение входящих и исходящих вершин для каждой вершины
            for (const [ind, vert] of pages[0].graph.entries()) {
                let j = ind;
                for (let i = 0; i < vertNum; i++) {
                    if (matrix[i][j]) {
                        vert.inList.push(pages[0].graph[i]);
                    }
                    if (matrix[j][i]) {
                        vert.outList.push(pages[0].graph[i]);
                    }
                }
                vert.adjList = vert.inList.concat(vert.outList);
            }

            // Инициализация подграфов
            for (let i = 1; i <= pagesNum; i++) {
                //let x = i * 400 + 400;
                let x = i * 400 - 200;
                let y = WH * (0.25 + (i % 2) / 2) - 50;
                pages.push(new Page(x, y, graphRad / pagesNum + 50));
                //console.log("Page after init", i, pages[i].graph);
            }


            // Граф оставшихся вершин (разность исходного графа и подграфов)
            let tempGraph = pages[0].graph;
            console.log(tempGraph.length)

            // Проход по страницам
            for (let i = 1; i <= pagesNum; i++) {
                // Задание вершины для начала построения из оставшейся части графа
                // Костыль ещё один
                //let randInd = 24;
                //if (i !== 1) {
                    let randInd = Math.floor(Math.random() * tempGraph.length);
                //}
                pages[i].graph.push(tempGraph[randInd]);

                // Костыль
                tempGraph[randInd].pageInd = i;

                tempGraph[randInd].isBelong = true;
                tempGraph = tempGraph.filter(vert => vert.isBelong === false);

                // Счётчик внесённых вершин
                while (pages[i].graph.length < vertPerPage && tempGraph.length > 0) {
                    let PrVertInd = -1; // Индекс приоритетной для внесения вершины.
                    let passVerts = []; // Массив пройденных вершин (чтобы исключить возможность просмотра одной и той же вершины несколько раз)
                    let maxCoef = 0; // Максимальный на данный момент коэф. связности среди adjVert
                    let maxdPlus = 0;
                    let maxdMinus = 0;

                    // Проход по вершинам текущего графа
                    for (const vert of pages[i].graph) {
                        let curCoef = 0; // Коэф. связности текущей вершины adjVert

                        // Проход по инцедентным вершинам (претендентам)
                        for (const adjVert of vert.adjList) {
                            // Проверка на то, была ли вершина уже рассмотрена и находится ли уже на странице
                            if (passVerts.indexOf(adjVert) !== -1 || adjVert.isBelong) {
                                continue;
                            }

                            // Добавление в список рассмотренных вершин
                            passVerts.push(adjVert);

                            let dPlus = 0;
                            let dMinus = 0;

                            // Расчёт кол-ва инцедентных вершин из текущего графа
                            for (const subAdjVert of adjVert.adjList) {
                                if (pages[i].graph.indexOf(subAdjVert) !== -1)
                                    dPlus++;
                                else
                                    dMinus++;
                            }

                            // Расчёт коэфициента связности
                            curCoef = dPlus / (dPlus + dMinus);

                            // Определение приоритетной вершины
                            if (curCoef > maxCoef) {
                                PrVertInd = adjVert.ind;
                                maxCoef = curCoef;
                                maxdPlus = dPlus;
                                maxdMinus = dMinus
                            }
                            else if (curCoef === maxCoef) {
                                if (curCoef > 0.5 && dMinus > maxdMinus) {
                                    PrVertInd = adjVert.ind;
                                    maxCoef = curCoef;
                                    maxdPlus = dPlus;
                                    maxdMinus = dMinus;
                                }
                                if (curCoef < 0.5 && dMinus < maxdMinus) {
                                    PrVertInd = adjVert.ind;
                                    maxCoef = curCoef;
                                    maxdPlus = dPlus;
                                    maxdMinus = dMinus;
                                }
                            }
                        }
                    }

                    // Костыль 2. почему-то никакая вершина не подошла по условиям.
                    if (PrVertInd === -1) {
                        break;
                    }

                    // Добавление приоритетной вершины
                    pages[i].graph.push(pages[0].graph[PrVertInd]);
                    // Помечаем вершину как занесённую
                    pages[0].graph[PrVertInd].isBelong = true;
                    pages[0].graph[PrVertInd].pageInd = i;
                    // Удаление внесённой вершины из списка рассматриваемых вершин
                    tempGraph = tempGraph.filter(vert => vert.isBelong === false);
                }
            }

            // Костыль 3. Если почему-то остались элементы то переносим их на 3 сраницу.
            while (tempGraph.length > 0) {
                console.log("delete")
                let el = tempGraph.pop()
                pages[pagesNum].graph.push(el);
                el.pageInd = pagesNum;
            }

            console.log(pages);
            for (const page of pages) {
                console.log(page.graph.map(item => item.ind))
            }

            for (const vert of pages[0].graph) {
                for (const outVert of vert.inList) {
                    if (vert.pageInd !== outVert.pageInd) {
                        console.log(vert.ind, outVert.ind);
                        lineSum++;
                    }
                }
            }

            document.getElementById("Count").innerHTML = lineSum.toString();
            pages[0].recalculate();
            isReady = true;
        })


    // Общие параметры отрисовки
    createCanvas(WW, WH);
    textSize(14);
    textAlign("center");
}



function draw() {
    if (isReady) {
        drawCounter++;
        background(255);
        pages[0].display();
        if (drawCounter < 300) {
            pages[0].recalculate();
        }
        else {
            pages[1].recalculate();
            pages[2].recalculate();
            pages[3].recalculate();

        }
        //text(lineSum, WW / 2, WH / 2);
    }
}