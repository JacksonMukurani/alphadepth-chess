// AlphaDepth Chess Engine Server
const express = require('express');
const { Chess } = require('chess.js');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// 1. HEALTH CHECK ENDPOINT
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AlphaDepth Chess Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. ANALYZE POSITION ENDPOINT
app.post('/api/analyze', (req, res) => {
  const { fen, depth = 20 } = req.body;
  
  if (!fen) {
    return res.status(400).json({ error: 'FEN position required' });
  }

  // Validate FEN
  const chess = new Chess();
  if (!chess.load(fen)) {
    return res.status(400).json({ error: 'Invalid FEN position' });
  }

  // Simulate analysis
  const analysisResult = {
    evaluation: 0.15,
    bestMove: "e4",
    topMoves: [
      { move: "e4", evaluation: 0.15 },
      { move: "d4", evaluation: 0.12 },
      { move: "Nf3", evaluation: 0.08 }
    ],
    depth: depth,
    analysisTime: "1.2s"
  };

  res.json({
    status: 'completed',
    result: analysisResult,
    message: 'Analysis complete'
  });
});

// 3. GET GAME INFO
app.get('/api/game-info', (req, res) => {
  const { fen } = req.query;
  
  if (!fen) {
    return res.status(400).json({ error: 'FEN parameter required' });
  }

  const chess = new Chess();
  if (chess.load(fen)) {
    res.json({
      fen: fen,
      turn: chess.turn(),
      gameOver: chess.isGameOver(),
      inCheck: chess.inCheck(),
      legalMoves: chess.moves().length
    });
  } else {
    res.status(400).json({ error: 'Invalid FEN' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('♟️  AlphaDepth Chess Engine Started!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
});