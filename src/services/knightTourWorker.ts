import {KnightTourSolver} from "./KnightTourSolver";

onmessage = async function (e: MessageEvent) {
    const {board, x, y, path,} = e.data;
    try {
        const result = await KnightTourSolver.recursiveTour(board, x, y, path);
        postMessage(result);
    } catch (e) {
        postMessage(false);
    }

};
