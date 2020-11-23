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
let isReady = false; // Флаг завершения основного расчёта
let lineSum = 0; // Кол-во рёбер между страницами

// Макросы размеров холста
let WW; // Ширина экрана
let WH; // Высота экрана

let time = 0;

// ПРОГРАММА
function setup() {
    // Макросы размеров холста
    WW = windowWidth; // Ширина экрана
    WH = windowHeight; // Высота экрана

    // Основной Алгоритм
    fetch('AdjList')
        .then(response => response.text())
        .then(text => {
            // Чтение исходного графа из файла и определение размера
            scrAdjList = text.split('\n').map(str => str.split(' ').map(ch => parseInt(ch)))
            let vertNum = scrAdjList.length;

            // Чистка от NaN (образуется при пустом поле в AdjList)
            for (let vert of scrAdjList) {
                if (isNaN(vert[0])) {
                    vert.pop()
                }
            }

            // Подсчёт кол-ва страниц
            pagesNum = Math.floor(vertNum / vertPerPage) +
                Math.floor(vertNum / vertPerPage - Math.floor(vertNum / vertPerPage) + 1 - 1e-5);

            // Инициализация и заполнение исходной страницы
            pages.push(new Page(WW / 2, WH / 2, graphRad));

            for (let i = 0; i < vertNum; i++) {
                pages[0].graph.push(new Vert(i));
            }

            // Определение входящих, исходящих и смежных вершин для каждой вершины
            for (const [ind, row]  of scrAdjList.entries()) {
                let curVert = pages[0].graph[ind]; // Текущая вершина
                for (const outInd of row) {
                    let outVert = pages[0].graph[outInd]; // Исходящая вершина
                    // Рассмотрение текущей вершины
                    curVert.outList.push(outVert); // Добавление исходящей вершины
                    curVert.adjList.push(outVert); // Добавление смежной вершины
                    // Рассмотрение выходящей вершины
                    outVert.inList.push(curVert); // Добавление текущей вершины как входящей
                    outVert.adjList.push(curVert); // Добавление текущей вершины как смежной
                }
            }

            // Инициализация подграфов
            for (let i = 1; i <= pagesNum; i++) {
                let x = i * 400 - 200;
                let y = WH * (0.25 + (i % 2) / 2) - 50;
                pages.push(new Page(x, y, graphRad / pagesNum + 50));
            }

            // Граф оставшихся вершин (разность исходного графа и подграфов)
            let tempGraph = pages[0].graph;





            // Проход по страницам -------------------------------------------------------------------------------------
            for (let i = 1; i <= pagesNum; i++) {
                // Задание вершины для начала построения из оставшейся части графа
                let randInd = Math.floor(Math.random() * tempGraph.length);
                pages[i].graph.push(tempGraph[randInd]);
                tempGraph[randInd].pageInd = i;
                tempGraph[randInd].isBelong = true;
                tempGraph = tempGraph.filter(vert => vert.isBelong === false);

                // Счётчик внесённых вершин
                while (pages[i].graph.length < vertPerPage && tempGraph.length > 0) {
                    let PrVertInd = -1; // Индекс приоритетной для внесения вершины.
                    let maxCoef = 0; // Максимальный на данный момент коэф. связности среди adjVert
                    let maxdPlus = 0;
                    let maxdMinus = 0;
                    let passVerts = []; // Массив пройденных вершин (чтобы исключить возможность просмотра одной и той же вершины несколько раз)


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
                            else if (PrVertInd === -1){
                                console.log("WTF");
                            }
                        }
                    }

                    // Костыль 2. если почему-то никакая вершина не подошла по условиям.
                    if (PrVertInd === -1) {
                        console.log("vershina ne podoshla");
                        break;
                    }

                    // Добавление приоритетной вершины
                    pages[i].graph.push(pages[0].graph[PrVertInd]);
                    pages[0].graph[PrVertInd].isBelong = true;
                    pages[0].graph[PrVertInd].pageInd = i;

                    // Удаление внесённой вершины из списка рассматриваемых вершин
                    tempGraph = tempGraph.filter(vert => vert.isBelong === false);
                }
            }
            //----------------------------------------------------------------------------------------------------------

            // Костыль 3. Если почему-то остались элементы то переносим их на 3 сраницу.
            while (tempGraph.length > 0) {
                console.log("delete")
                let el = tempGraph.pop()
                pages[pagesNum].graph.push(el);
                el.pageInd = pagesNum;
            }

            // Подсчёт кол-ва рёбер между страницами.
            for (const vert of pages[0].graph) {
                for (const outVert of vert.inList) {
                    if (vert.pageInd !== outVert.pageInd) {
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
        time++;
        background(255);
        pages[0].display();
        if (time < 200) {
            pages[0].recalculate();
        }
        else {
            pages[1].recalculate();
            pages[2].recalculate();
            pages[3].recalculate();
        }
    }
}