// src/ChessBoard.jsx
import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from 'axios';

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    try {
      gameCopy.move(move);
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      return true;
    } catch (error) {
      return false;
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    return move;
  };

  const analyzePosition = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/analyze', {
        fen: position,
        depth: 20
      });
      setAnalysis(response.data.result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setLoading(false);
  };

  const resetBoard = () => {
    setGame(new Chess());
    setPosition('start');
    setAnalysis(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>AlphaDepth Chess Analysis</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Chessboard */}
        <div>
          <Chessboard 
            position={position}
            onPieceDrop={onDrop}
            boardWidth={400}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={analyzePosition} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Position'}
            </button>
            <button onClick={resetBoard} style={{ marginLeft: '10px' }}>
              Reset Board
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>Analysis</h3>
          {analysis ? (
            <div>
              <p><strong>Evaluation:</strong> {analysis.evaluation}</p>
              <p><strong>Best Move:</strong> {analysis.bestMove}</p>
              <p><strong>Depth:</strong> {analysis.depth}</p>
              <div>
                <strong>Top Moves:</strong>
                <ul>
                  {analysis.topMoves.map((moveObj, index) => (
                    <li key={index}>{moveObj.move}: {moveObj.evaluation}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No analysis yet. Make moves and click "Analyze Position"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;