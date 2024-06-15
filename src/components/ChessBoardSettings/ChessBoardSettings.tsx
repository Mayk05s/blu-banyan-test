import React, {useState} from 'react';
import {Box, Button, FormControlLabel, Switch, TextField} from '@mui/material';
import {useChessBoard} from "../../containers/ChessBoardContext";
import {Chessboard} from "../../model/Chessboard";

const ChessBoardSettings: React.FC = () => {
    const {chessboard, setChessboard} = useChessBoard();
    const [rows, setRows] = useState<number>(chessboard.rows);
    const [cols, setCols] = useState<number>(chessboard.cols);
    const [isSquare, setIsSquare] = useState<boolean>(rows === cols);


    const handleApplySettings = () => {
        const newChessboard = new Chessboard(rows, cols);
        setChessboard(newChessboard);
    }

    const handleIsSquareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSquare(event.target.checked);
        if (event.target.checked) {
            setCols(rows);
        }
    }

    return (
        <Box>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2} mb={4}>
                <TextField
                    label={isSquare ? "Size" : "Rows"}
                    type="number"
                    value={rows}
                    onChange={(e) => {
                        const newSize = parseInt(e.target.value, 10);
                        setRows(newSize);
                        if (isSquare) {
                            setCols(newSize);
                        }
                    }}
                    variant="outlined"
                />
                {!isSquare && (
                    <TextField
                        label="Columns"
                        type="number"
                        value={cols}
                        onChange={(e) => setCols(parseInt(e.target.value, 10))}
                        variant="outlined"
                    />
                )}
                <Button variant="contained" color="primary" onClick={handleApplySettings}>
                    Apply Settings
                </Button>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                <FormControlLabel
                    control={<Switch checked={isSquare} onChange={handleIsSquareChange}/>}
                    label="Square"
                />
            </Box>
        </Box>
    );
};

export default ChessBoardSettings;
