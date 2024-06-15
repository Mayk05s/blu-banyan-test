
export interface ISolverResult{
    path: [number, number][] | false;
    iterations: number;
}
export interface ISolverState {
    startTime: number;
    activeWorkers: number;
    iterations: number;
    completed: boolean;
}
