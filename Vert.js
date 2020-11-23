class Vert {
    x = 0;
    y = 0;
    pageInd = 0; // Индекс страницы, к которой принадлежит вершина
    isBelong = false; // Флаг, определяющий была ли уже внесена вершина на одну из страниц
    adjList = []; // Список всех смежных вершин
    inList = []; // Список смежных входящих вершин
    outList = []; // Список смежных выходящих вершин

    constructor(ind) {
        this.ind = ind;
    }

    // Отрисовка вершины
    display (rad) {
        ellipse(this.x, this.y, rad, rad);
        text(this.ind, this.x, this.y + 5);
    }

    // Построение рёбер к инцедентным вершинам
    drawEdges (graph) {
        for (let target of this.outList) {
            drawArrow(
                createVector(this.x, this.y),
                createVector(target.x - this.x, target.y - this.y),
                'black'
            )
        }
    }
}