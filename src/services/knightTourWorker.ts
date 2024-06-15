import {KnightTourSolver} from "./KnightTourSolver";

onmessage = async function (e: MessageEvent) {
    const {board, x, y, path,} = e.data;
    const result = await KnightTourSolver.recursiveTour(board, x, y, path);
    postMessage(result);
};
