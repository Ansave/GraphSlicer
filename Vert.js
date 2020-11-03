class Vert {
    x = 0;
    y = 0;

    constructor(ind, arr) {
        this.ind = ind;
        this.arr = arr;
    }

    display (rad) {
        ellipse(this.x, this.y, vertRad, rad);
        text(this.ind, this.x, this.y + 5);
    }

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