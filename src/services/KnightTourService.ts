import {Chessboard} from "../model/Chessboard";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import {KnightTourSolver} from "./KnightTourSolver";

export class KnightTourService {
    chessboard: Chessboard;
    maxWorkers: number;

    constructor(chessboard: Chessboard, maxWorkers: number = 1) {
        this.chessboard = chessboard;
        this.maxWorkers = maxWorkers;
    }

    log(startTime: number) {
        const executionTime = Date.now() - startTime;
        const minutes = Math.floor(executionTime / 60000);
        const seconds = Math.floor((executionTime % 60000) / 1000);
        const milliseconds = executionTime % 1000;

        let time = `${milliseconds}ms`;
        if (seconds > 0) {
            time = `${seconds}s ${time}`;
        }
        if (minutes > 0) {
            time = `${minutes}s ${time}`;
        }
        console.log(
            `executedTime: %c${time} `,
            'color: green; font-weight: bold',
        );
    }

    async solveKnightTour(): Promise<[number, number][] | false> {
        const startTime = Date.now();
        const result = await KnightTourSolver.startTour(this.chessboard);
        // console.log(result, 'result');

        this.log(startTime);
        return result;
    }
}
