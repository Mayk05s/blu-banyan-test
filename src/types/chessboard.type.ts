export interface IChessboard {
    rows: number;
    cols: number;
    startPosition?: [number, number];
    tourPath?: [number, number][];
    completed: boolean;
}
