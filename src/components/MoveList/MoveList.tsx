import React, {FC, SyntheticEvent, useState} from 'react';
import {useChessBoard} from "../../containers/ChessBoardContext";
import {Alert, Box, Snackbar, Typography, useTheme} from "@mui/material";

const MoveList: FC = () => {
    const {chessboard} = useChessBoard();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const formattedMoves = chessboard.getLetterRepresentation().reduce((acc: string[], move: string, index: number) => {
        const chunkIndex = Math.floor(index / 5);

        if (!acc[chunkIndex]) {
            acc[chunkIndex] = '';
        }

        acc[chunkIndex] += `${move}${index % 5 === 4 ? '' : ' -> '}`;

        return acc;
    }, []);

    React.useEffect(() => {
        if (chessboard.tourPath?.length === 0 && chessboard.completed) {
            setOpen(true);
        }
    }, [chessboard]);

    const handleClose = (event: Event | SyntheticEvent<any, Event>, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <Box >
            <Typography variant="h4" className="mt5" gutterBottom>Moves</Typography>
            <Box mb={2}>
                {formattedMoves && formattedMoves.map((row, index) => (
                    <Typography key={index} variant="body1">{row}</Typography>
                ))}
            </Box>
            {chessboard.tourPath?.length === 0 && chessboard.completed && (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                        Not completed!
                    </Typography>
                </Box>
            )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert
                    onClose={handleClose}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    No way found. Try another starting point!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MoveList;
