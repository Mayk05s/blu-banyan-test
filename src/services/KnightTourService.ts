import {Chessboard} from "../model/Chessboard";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import {ISolverState} from "../types/SolverResult.type";
import {KnightTourSolver} from "./KnightTourSolver";

export class KnightTourService {
    chessboard: Chessboard;
    maxWorkers: number;

    constructor(chessboard: Chessboard, maxWorkers: number = 1) {
        this.chessboard = chessboard;
        this.maxWorkers = maxWorkers;
    }

    log({iterations, startTime}: ISolverState) {
        const executionTime = Date.now() - startTime;
        const minutes = Math.floor(executionTime / 60000);
        const seconds = Math.floor((executionTime % 60000) / 1000);
        const milliseconds = executionTime % 1000;

        console.log(
            `iterations: %c${iterations}`,
            'color: red; font-weight: bold'
        );
        console.log(
            `executedTime: %c${minutes}m %c${seconds}s %c${milliseconds}ms`,
            'color: red; font-weight: bold',
            'color: blue; font-weight: bold',
            'color: green; font-weight: bold'
        );
    }

    async solveKnightTour(timeout: number = 5000): Promise<[number, number][] | false> {
        const state: ISolverState = {
            startTime: Date.now(),
            activeWorkers: 0,
            iterations: 0,
            completed: false
        };
        const result = await KnightTourSolver.startAsyncTour(this.chessboard, state);
        console.log(result, 'result');

        this.log(state);
        return result;
    }
}
