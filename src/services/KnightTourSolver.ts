import {IChessboard} from "../types/chessboard.type";
import {ISolverState} from "../types/SolverResult.type";

const directions = [
    [2, 1], [1, 2], [-1, 2], [-2, 1],
    [-2, -1], [-1, -2], [1, -2], [2, -1]
];

export class KnightTourSolver {
    static activeWorkers: number = 0;
    static maxWorkers = 1;

    static getBoard(chessboard: IChessboard): number[][] {
        return Array.from({length: chessboard.rows}, () => Array.from({length: chessboard.cols}, () => 0));
    }

    static getBoardSize(board: number[][]): number {
        return board.length * board[0].length;
    }

    static startAsyncTour(chessboard: IChessboard, state: ISolverState, timeout = 5000): Promise<[number, number][] | false> {
        return new Promise((resolve) => {
            KnightTourSolver.startTour(chessboard, state).then((result) => {
                resolve(result);
            });
            setTimeout(() => {
                resolve(false);
            }, timeout);
        });
    }

    static workerRecursiveTour(board: number[][], x: number, y: number, path: [number, number][]): Promise<[number, number][] | false> {
        return new Promise((resolve, reject) => {
            if (KnightTourSolver.activeWorkers >= KnightTourSolver.maxWorkers) {
                resolve(KnightTourSolver.recursiveTour(board, x, y, path));
                return;
            }

            const worker = new Worker(new URL('../services/knightTourWorker.ts', import.meta.url));
            worker.onmessage = (e: MessageEvent) => {
                const result = e.data;
                resolve(result);
                worker.terminate();
                KnightTourSolver.activeWorkers--;
            };
            worker.onerror = (e) => {
                reject(e);
                worker.terminate();
                KnightTourSolver.activeWorkers--;
            };
            KnightTourSolver.activeWorkers++;
            worker.postMessage({board, x, y, path});
        });
    }

    static async startTour(chessboard: IChessboard, state: ISolverState): Promise<[number, number][] | false> {
        if (!chessboard.startPosition) {
            return false;
        }
        KnightTourSolver.activeWorkers = 0;
        const [startX, startY] = chessboard.startPosition;
        const board = KnightTourSolver.getBoard(chessboard);
        try {
            const path = await KnightTourSolver.recursiveTour(board, startX, startY, []);
            return path;
        } catch {
            return false;
        }
    }

    static async recursiveTour(board: number[][], x: number, y: number, path: [number, number][] = []): Promise<[number, number][] | false> {
        board[x][y] = 1; // mark the current position as visited
        path.push([x, y]); // add the current position to the path
        if (path.length === KnightTourSolver.getBoardSize(board)) {
            return path; // if the path is full return the path
        }
        const availableMoves = this.getAvailableMoves(board, x, y);
        const promises = []
        for (const [nextX, nextY] of availableMoves) {
            promises.push(KnightTourSolver.workerRecursiveTour([...board], nextX, nextY, [...path]));
        }

        try {
            return await Promise.any(promises);
        } catch {
            board[x][y] = 0;
            path.pop();
            throw new Error('No path found');
        }
    }


    static checkMove(board: number[][], x: number, y: number, i: number): [number, number] | false {
        const [dx, dy] = directions[i];
        const newX = x + dx;
        const newY = y + dy;
        if (board[newX] && board[newX][newY] === 0) {
            return [newX, newY];
        }
        return false;
    }

    static getAvailableMoves(board: number[][], x: number, y: number): [number, number][] {
        const availableMoves: [number, number][][] = Array.from({length: 9}, () => []);

        for (let i = 0; i < 8; i++) {
            const move = KnightTourSolver.checkMove(board, x, y, i);
            if (move) {
                const [newX, newY] = move;
                const nextMovesCount = KnightTourSolver.countNextMoves(board, newX, newY);
                availableMoves[nextMovesCount].push([newX, newY]);
            }
        }
        return availableMoves.flat();
    }

    static countNextMoves(board: number[][], x: number, y: number): number {
        let count = 0;
        for (let i = 0; i < 8; i++) {
            const move = KnightTourSolver.checkMove(board, x, y, i);
            if (move) {
                count++;
            }
        }
        return count;
    }

}
