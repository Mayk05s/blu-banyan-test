import React, {FC, SyntheticEvent, useState} from 'react';
import {useChessBoard} from '../../containers/ChessBoardContext';
import {Accordion, AccordionDetails, AccordionSummary, Alert, Box, Snackbar, Typography, useTheme} from '@mui/material';
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';
import {Rnd} from 'react-rnd';
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


    const content = (
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
    );
    return (
        <>
            {isDesktop ? (
                <Rnd
                    enableResizing={false}
                    default={{
                        x: window.innerWidth - 240,
                        y: window.innerHeight - 300,
                        width: 240,
                        height: 300,
                    }}
                >
                    {content}
                </Rnd>
            ) : (
                <Box width="100%" textAlign="center">
                    {content}
                </Box>
            )}
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
