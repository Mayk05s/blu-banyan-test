import React, {FC} from 'react';
import {useChessBoard} from "../../containers/ChessBoardContext";
import {Typography} from "@mui/material";
const MoveList: FC = () => {
    const {chessboard} = useChessBoard();

    const formattedMoves =  chessboard.getLetterRepresentation().reduce((acc: string[], move: string, index: number) => {
        const chunkIndex = Math.floor(index / 5);

        if (!acc[chunkIndex]) {
            acc[chunkIndex] = '';
        }

        acc[chunkIndex] += `${move}${index % 5 === 4 ? '' : ' -> '}`;

        return acc;
    }, []);

    return (
        <div>
            <h2>Moves</h2>
            <div>
                {/*{JSON.stringify(chessboard.tourPath)}*/}
                {formattedMoves && formattedMoves.map((row, index) => (
                    <div key={index}>{row}</div>
                ))}
            </div>
            {chessboard.tourPath && !chessboard.completed && (
                <Typography variant="body2" sx={{color: 'red'}} gutterBottom>
                    Not completed
                </Typography>
            )}
        </div>
    );
};

export default MoveList;
