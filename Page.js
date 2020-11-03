class Page {
    graph = [];
    constructor(x, y, rad) {
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

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
            for (const target of this.graph[i].arr) {
                matrix[i][target] = 1;
            }
        }

        return matrix;
    }
}