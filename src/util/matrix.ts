import Vector from "./vector";

export default class Matrix {
    get m() {
        return this.values.length;
    }
    get n() {
        return this.values[0].length;
    }

    constructor(...values: number[][]) {
        this.values = values;
    }

    private values: number[][];

    public index(i: number, j: number): number {
        return this.values[i][j];
    }

    public col(i: number): number[] {
        let values = [];
        for (let j = 0; j < this.m; j++) {
            values.push(this.index(i, j));
        }
        return values;
    }

    public row(j: number): number[] {
        return this.values[j].slice();
    }

    public add(matrix: Matrix): Matrix {
        if (this.m != matrix.m || this.n != matrix.n) {
            throw new Error("Cannot perform addition on matrices of different sizes.");
        }

        let values = [];
        for (let i = 0; i < this.m; i++) {
            let row = [];
            for (let j = 0; j < this.n; j++) {
                row.push(this.index(i, j) + matrix.index(i, j));
            }
            values.push(row);
        }

        return new Matrix(...values);
    }

    public scale(scalar: number): Matrix {
        let values = [];
        for (let i = 0; i < this.m; i++) {
            let row = [];
            for (let j = 0; j < this.n; j++) {
                row.push(this.index(i, j) * scalar);
            }
            values.push(row);
        }

        return new Matrix(...values);
    }

    public mul(matrix: Matrix): Matrix {
        if (this.n != matrix.m) {
            throw new Error("Cannot multiply matrices; columns in A do not match rows in B.");
        }

        let values = [];
        for (let i = 0; i < this.m; i++) {
            let row = [];
            for (let j = 0; j < matrix.n; j++) {
                let sum = 0;
                for (let k = 0; k < this.n; k++) {
                    sum += this.index(i, k) * matrix.index(k, j);
                }
                row.push(sum);
            }
            values.push(row);
        }

        return new Matrix(...values);
    }

    public static rotation(angles: Vector): Matrix {
        const alpha = angles.x, beta = angles.y, gamma = angles.z;
        return new Matrix(
            [
                Math.cos(alpha) * Math.cos(beta),
                Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma) - Math.sin(alpha) * Math.cos(gamma),
                Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma) + Math.sin(alpha) * Math.sin(gamma)
            ],
            [
                Math.sin(alpha) * Math.cos(beta),
                Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma) + Math.cos(alpha) * Math.cos(gamma),
                Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma) - Math.cos(alpha) * Math.sin(gamma)
            ],
            [
                Math.sin(beta),
                Math.cos(beta) * Math.sin(gamma),
                Math.cos(beta) * Math.cos(gamma)
            ]
        );
    }
}