// ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ
// Параметры колец
let circRad = 300; // Радиус кольца вершин исходного графа

// Параметры графов
let graph = []; // Граф, как массив вершин
let vertNum = 25; // Кол-во вершин
let vertRad = 40; // Радиус вершин
let vertAng = 2 * Math.PI / vertNum; // Угол между вершинами

// Параметры страниц
let pages = []; // Массив страниц
let vertPerPage = 10; // Макс. кол-во вершин на странице
let pagesNum;

// Исходные данные
let scrAdjList; // Список инцедентных вершин


// ПРОГРАММА
function setup() {
    // Подсчёт кол-ва страниц
    pagesNum = Math.floor(vertNum / vertPerPage) +
        Math.floor(vertNum / vertPerPage - Math.floor(vertNum / vertPerPage) + 1 - 1e-5);

    // Чтение графа из файла
    fetch('AdjList')
        .then(response => response.text())
        .then(text => {
            scrAdjList = text.split('\n').map(str => str.split(' ').map(ch => parseInt(ch)))



            // Инициализация графа
            for (let i = 0; i < vertNum; i++) {
                graph.push(new Vert(i,scrAdjList[i]));
            }

            // Разрезание графа
            for (let i = 0; i < pagesNum; i++) {

            }

            //console.log(graph)
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
            graph[i].x = lerp(graph[i].x, circRad * Math.cos(curAngle), 0.1);
            graph[i].y = lerp(graph[i].y, circRad * Math.sin(curAngle), 0.1);

            // Отрисовка вершин и рёбер
            graph[i].drawEdges(graph);
            graph[i].display(vertRad);
        }
    }
}