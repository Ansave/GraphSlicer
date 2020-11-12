class Vert {
    x = 0;
    y = 0;
    adjList = []; // Список всех смежных вершин
    inList = []; // Список смежных входящих вершин
    outList = []; // Список смежных выходящих вершин
    pageInd = 0;
    isBelong = false; // Флаг, определяющий была ли уже внесена вершина на одну из страниц
    constructor(ind, arr) {
        this.ind = ind;
        this.arr = arr;
    }

    // Отрисовка вершины
    display (rad) {
        ellipse(this.x, this.y, rad, rad);
        text(this.ind, this.x, this.y + 5);
    }

    // Построение рёбер к инцедентным вершинам
    drawEdges (graph) {
        for (let target of this.arr) {
            drawArrow(
                createVector(this.x, this.y),
                createVector(graph[target].x - this.x, graph[target].y - this.y),
                'black'
            )
        }
    }
}