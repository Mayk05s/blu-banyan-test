import React, {useEffect, useState} from 'react';
import './ChessBoard.scss';
import {useChessBoard} from "../../containers/ChessBoardContext";
import {KnightTourService} from "../../services/KnightTourService";
import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import {Chessboard} from "../../model/Chessboard";

const ChessBoard: React.FC = () => {
    const {chessboard, setChessboard} = useChessBoard();

    // Use Local State for Tour Results
    const [startPosition, setStartPosition] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // useEffect to Trigger Tour Calculation
    useEffect(() => {
        if (startPosition) {
            console.log('newKnightsTour:');
        }
    }, [chessboard.startPosition, chessboard.rows, chessboard.cols]);

    const updateChessboard = (chessboard: Chessboard) => {
        const newChessboard = new Chessboard(chessboard.rows, chessboard.cols);
        if (chessboard.startPosition) {
            newChessboard.setStartPosition(chessboard.startPosition);
        }
        if (chessboard.tourPath) {
            newChessboard.setTourPath(chessboard.tourPath);
        }
        setChessboard(newChessboard);
        return newChessboard;
    }
    const handleSquareClick = async (row: number, col: number) => {
        setStartPosition([row, col]);
        chessboard.setStartPosition([row, col]);
        const newChessboard = updateChessboard(chessboard);

        setLoading(true);
        const knightTourService = new KnightTourService(newChessboard)
        const newKnightsTour = await knightTourService.solveKnightTour();
        setLoading(false);
        chessboard.setTourPath(newKnightsTour);
        updateChessboard(chessboard);
    };

    const createBoard = () => {
        const boardData = chessboard.generateBoard();
        return boardData.map((boardRow, rowIndex) => (
            <tr key={rowIndex}>
                <td className="row-label">{chessboard.rows - rowIndex}</td>
                {boardRow.map((squareData, colIndex) => {
                    const isWhite = (rowIndex + colIndex) % 2 === 0;
                    let squareClass = isWhite ? 'chess-square white-square' : 'chess-square black-square';

                    if (chessboard.startPosition && chessboard.startPosition[0] === rowIndex && chessboard.startPosition[1] === colIndex) {
                        squareClass += ' highlighted-square';
                    }
                    return (
                        <td
                            key={colIndex}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                            className={squareClass}
                        >
                            {squareData}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" sx={{color: 'red'}} gutterBottom>
                {chessboard.startPosition ? 'Click on another point to change the calculation.' : 'Please click to start the calculation.'}
            </Typography>
            <Box display="flex" justifyContent="center">
                <table id="chessboard">
                    <tbody>
                    <tr>
                        <td className="column-label"></td>
                        {Array.from({length: chessboard.cols}, (_, idx) => (
                            <td key={idx} className="column-label">{String.fromCharCode(65 + idx)}</td>
                        ))}
                    </tr>
                    {createBoard()}
                    </tbody>
                </table>
            </Box>
            <Backdrop open={loading} style={{color: '#fff', zIndex: 1500}}> {/* Добавьте Backdrop */}
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
};

export default ChessBoard;
