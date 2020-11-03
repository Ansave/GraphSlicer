// ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ
// Параметры графов
let graphRad = 300; // Радиус исходного графа
let subGraphRad = 150; // Радиус подграфов
let vertNum = 25; // Кол-во вершин исходного графа
let vertRad = 40; // Радиус вершин
let vertAng = 2 * Math.PI / vertNum; // Угол между вершинами

// Параметры страниц
let pages = []; // Массив страниц
let vertPerPage = 10; // Макс. кол-во вершин на странице
let pagesNum; // Кол-во страниц

// Исходные данные
let scrAdjList; // Список инцедентных вершин


// ПРОГРАММА
function setup() {
    // Подсчёт кол-ва страниц
    pagesNum = Math.floor(vertNum / vertPerPage) +
        Math.floor(vertNum / vertPerPage - Math.floor(vertNum / vertPerPage) + 1 - 1e-5);

    pages.push(new Page(windowWidth / 2, windowHeight / 2, graphRad));

    // Чтение графа из файла
    fetch('AdjList')
        .then(response => response.text())
        .then(text => {
            scrAdjList = text.split('\n').map(str => str.split(' ').map(ch => parseInt(ch)))

            // Инициализация графа
            for (let i = 0; i < vertNum; i++) {
                pages[0].graph.push(new Vert(i,scrAdjList[i]));
            }

            // Разрезание графа
            for (let i = 1; i < pagesNum; i++) {
                while (pages[i] < pagesNum) {

                }
            }

            console.log(pages[0].adjMatrix());
        })

    // Общие параметры отрисовки
    createCanvas(windowWidth, windowHeight);
    textSize(14);
    textAlign("center");
}

function draw() {
    if (scrAdjList) {
        translate(windowWidth / 2, windowHeight / 2);
        background(255);

        for (let i = 0; i < vertNum; i++) {
            // Расчёт положений вершин
            let curAngle = vertAng * i;
            pages[0].graph[i].x = lerp(pages[0].graph[i].x, pages[0].rad * Math.cos(curAngle), 0.1);
            pages[0].graph[i].y = lerp(pages[0].graph[i].y, pages[0].rad * Math.sin(curAngle), 0.1);

            // Отрисовка вершин и рёбер
            pages[0].graph[i].drawEdges(pages[0].graph);
            pages[0].graph[i].display(vertRad);
        }
    }
}