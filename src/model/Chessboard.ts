import {IChessboard} from "../types/chessboard.type";

export class Chessboard implements IChessboard{
    rows: number;
    cols: number;
    startPosition?: [number, number];
    tourPath?: [number, number][];
    completed: boolean = false;


    constructor(rows: number = 5, cols?: number) {
        this.rows = rows;
        this.cols = cols || rows;
    }

    setStartPosition(position: [number, number]) {
        this.startPosition = position;
    }

    setTourPath(path: [number, number][] | false) {
        if (!path) {
            this.tourPath = [];
            this.completed = false;
            return;
        }
        this.tourPath = path;
        this.completed = true;
    }

    generateBoard() {
        const board = Array.from({length: this.rows}, () => Array(this.cols).fill(''));

        if (this.tourPath) {
            this.tourPath.forEach(([x, y], index) => {
                try {
                    board[x][y] = index + 1;
                } catch (e) {
                    console.error(e);
                }
            });
        }
        return board;
    }

    getColLetter(col: number) {
        return String.fromCharCode(65 + col); // 65 is the ASCII value for 'A'
    }

    getRowNumber(row: number) {
        return this.rows - row;
    }

    getLetterRepresentation(): string[] {
        const tourPath = this.tourPath || [];
        return tourPath.map(([row, col]) => {
            const letter = this.getColLetter(col);
            const number = this.getRowNumber(row);
            return `${letter}${number}`;
        });
    }

}
