import React, {FC, SyntheticEvent, useState} from 'react';
import {useChessBoard} from '../../containers/ChessBoardContext';
import {Accordion, AccordionDetails, AccordionSummary, Alert, Box, Snackbar, Typography, useTheme} from '@mui/material';
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import Draggable from 'react-draggable';
import useMediaQuery from '@mui/material/useMediaQuery';

const MoveList: FC = () => {
    const {chessboard} = useChessBoard();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
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
        <>
            <Draggable disabled={!isDesktop}>
                <Box
                    sx={{
                        position: isDesktop ? 'fixed' : 'default',
                        padding: theme.spacing(2),
                        zIndex: 1000,
                        cursor: 'move',
                        bottom: 0,
                        right: 0,
                        minWidth: isDesktop?200:'100%',
                        minHeight: isDesktop?200:'100%',
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography variant="h5" width="100%" textAlign="center">
                                Moves
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box mb={2}>
                                {formattedMoves && formattedMoves.map((row, index) => (
                                    <Typography key={index} variant="body1">{row}</Typography>
                                ))}
                            </Box>
                            {chessboard.tourPath?.length === 0 && chessboard.completed && (
                                <Box sx={{textAlign: 'center'}}>
                                    <Typography variant="body2" sx={{color: theme.palette.error.main}}>
                                        Not completed!
                                    </Typography>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Draggable>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert
                    onClose={handleClose}
                    severity="warning"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    No way found. Try another starting point!
                </Alert>
            </Snackbar>
        </>
    );
};

export default MoveList;
