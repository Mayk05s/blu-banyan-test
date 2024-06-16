import React, {useEffect, useRef, useState} from 'react';
import './ChessBoard.scss';
import {useChessBoard} from "../../containers/ChessBoardContext";
import {KnightTourService} from "../../services/KnightTourService";
import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import {Chessboard} from "../../model/Chessboard";
import {animated, useSpring} from '@react-spring/web';

const ChessBoard: React.FC = () => {
    const {chessboard, setChessboard} = useChessBoard();

    const [startPosition, setStartPosition] = useState<[number, number] | null>(null);
    const [tourPath, setTourPath] = useState<[number, number][] | false>([]);
    const [currentMove, setCurrentMove] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const chessboardRef = useRef<HTMLTableElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [styles, api] = useSpring(() => ({
        from: {x: 0, y: 0}
    }));

    const getCellCoordinates = (row: number, col: number) => {
        if (chessboardRef.current) {
            const cell = chessboardRef.current.rows[row + 1].cells[col + 1];
            const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = cell;
            return {x: offsetLeft + offsetWidth / 2 - 25, y: offsetTop + offsetHeight / 2 - 25};
        }
        return {x: 0, y: 0};
    };

    const moveKnight = (nextRow: number, nextCol: number) => {
        if (chessboardRef?.current) {
            const {x, y} = getCellCoordinates(nextRow, nextCol);
            api.start({
                x,
                y,
                config: {tension: 280, friction: 60}
            });
        }
    };

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setCurrentMove(0); // Reset currentMove on new startPosition or tourPath

        if (startPosition) {
            moveKnight(...startPosition);
        }

        if (tourPath && tourPath.length > 0) {
            moveKnight(...tourPath[0]);
            intervalRef.current = setInterval(() => {
                setCurrentMove((prevMove) => {
                    const nextMove = prevMove + 1;
                    if (nextMove < tourPath.length) {
                        const [nextRow, nextCol] = tourPath[nextMove];
                        moveKnight(nextRow, nextCol);
                    } else {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    }
                    return nextMove;
                });
            }, 600);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [startPosition,tourPath, api]);

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
    };

    const handleSquareClick = async (row: number, col: number) => {
        setStartPosition([row, col]);
        chessboard.setStartPosition([row, col]);
        const newChessboard = updateChessboard(chessboard);

        setLoading(true);
        const knightTourService = new KnightTourService(newChessboard);
        const newKnightsTour = await knightTourService.solveKnightTour();
        setLoading(false);
        chessboard.setTourPath(newKnightsTour);
        setTourPath(newKnightsTour);
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
                        squareClass += ' start-square';
                    }
                    return (
                        <td
                            key={colIndex}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                            className={squareClass}
                        >
                            <span>{squareData}</span>
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
            <Box display="flex" position="relative">
                <table ref={chessboardRef} className="chess-board">
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
                <animated.div className="knight" style={{
                    ...styles
                }}>♞
                </animated.div>
            </Box>
            <Backdrop open={loading} style={{color: '#fff', zIndex: 1500}}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
};

export default ChessBoard;
