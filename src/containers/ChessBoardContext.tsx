import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Chessboard } from "../model/Chessboard";

interface ChessBoardContextType {
    chessboard: Chessboard;
    setChessboard: React.Dispatch<React.SetStateAction<Chessboard>>;
}

const ChessBoardContext = createContext<ChessBoardContextType | undefined>(undefined);

export const ChessBoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chessboard, setChessboard] = useState<Chessboard>(new Chessboard());

    return (
        <ChessBoardContext.Provider value={{ chessboard, setChessboard }}>
            {children}
        </ChessBoardContext.Provider>
    );
};

export const useChessBoard = (): ChessBoardContextType => {
    const context = useContext(ChessBoardContext);
    if (context === undefined) {
        throw new Error('useChessBoard must be used within a ChessBoardProvider');
    }
    return context;
};
