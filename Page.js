class Page {
    graph = [];

    constructor(x, y, rad) {
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

    recalculate() {
        for (let i = 0; i < this.graph.length; i++) {
            // Расчёт положений вершин
            let curAngle = 2 * Math.PI / this.graph.length * i;
            this.graph[i].x =
                lerp(this.graph[i].x, this.rad * Math.cos(curAngle) + this.x, 0.1);
            this.graph[i].y =
                lerp(this.graph[i].y, this.rad * Math.sin(curAngle) + this.y, 0.1);
        }
    }

    // Отрисовка графа
    display() {
        for (let i = 0; i < this.graph.length; i++) {
            // Отрисовка вершин и рёбер
            //this.graph[i].drawEdges(this.graph);
            this.graph[i].drawEdges(pages[0].graph);
            this.graph[i].display(vertRad);
        }
    }

    // Составление матрицы смежности (Не используется в программе)
    adjMatrix() {
        let matrix = [];
        let n = this.graph.length;

        // Создание нулевой матрицы
        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                matrix[i].push(0);
            }
        }

        // Заполнение матрицы
        for (let i = 0; i < n; i++) {
            for (const target of this.graph[i].outList) {
                matrix[i][target.ind] = 1;
            }
        }

        return matrix;
    }
}