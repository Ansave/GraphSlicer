// Параметры холста
let sizeX = 700 // Ширина экрана
let sizeY = 750 // Высота экрана
// Параметры колец
let circRad = 300; // Радиус кольца вершин
let circShift = 100; // Максимальное смещение между кольцами
let circAngle = - Math.PI / 2; // Угол поворота кольца
// Параметры вершин
let verts = []; // Массив вершин
let n = 25; // Кол-во вершин
let angle = 2 * Math.PI / n; // Угол между вершинами
let vertRad = 40; // Радиус вершин
// Параметры графа
let graph; // Граф

function setup() {
    // Чтение графа из файла
    fetch('Graph')
        .then(response => response.text())
        .then(text => {
            graph = text.split('\n').map(str => str.split(' ').map(ch => parseInt(ch)))

            // Инициализация массива вершин
            for (let i = 0; i < n; i++) {
                verts.push(new Vert(i,graph[i]));
            }
            console.log(verts)
        })

    // Общие параметры отрисовки
    createCanvas(sizeX, sizeY);
    translate(sizeX / 2, sizeY / 2);
    textSize(14);
    textAlign("center");

    // Выравнивание колец
    if (n % 2) circAngle += angle/2;
}

function draw() {
    //angle = mouseX/3000;
    if (graph) {
        translate(sizeX / 2, sizeY / 2);
        background(255);

        for (let i = 0; i < n; i++) {
            // Расчёт положений вершин
            let curShift = circRad - Math.min(circShift, mouseY) * (i % 2);
            let curAngle = angle * i + circAngle;
            verts[i].x = lerp(verts[i].x, curShift * Math.cos(curAngle), 0.1);
            verts[i].y = lerp(verts[i].y, curShift * Math.sin(curAngle), 0.1);

            // Отрисовка рёбер
            for (let target of verts[i].arr) {
                drawArrow(
                    createVector(verts[i].x, verts[i].y),
                    createVector(verts[target].x - verts[i].x, verts[target].y - verts[i].y),
                    'black'
                )
            }

            // Отрисовка вершин
            ellipse(verts[i].x, verts[i].y, vertRad, vertRad);
            text(verts[i].ind, verts[i].x, verts[i].y + 5);
        }
    }
}