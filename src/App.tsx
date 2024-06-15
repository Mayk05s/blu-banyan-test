import React from 'react';
import ChessBoard from './components/ChessBoard/ChessBoard';
import ChessBoardSettings from './components/ChessBoardSettings/ChessBoardSettings';
import { ChessBoardProvider } from './containers/ChessBoardContext';
import MoveList from "./components/MoveList/MoveList";

const App: React.FC = () => {
    return (
        <ChessBoardProvider>
            <div className="App">
                <h1>Chess Board</h1>
                <ChessBoardSettings />
                <ChessBoard />
                <MoveList />
            </div>
        </ChessBoardProvider>
    );
};

export default App;
