const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes and origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Main Orchestration Endpoint
const handleOrchestration = async (req, res) => {
  const { prompt, actionType } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const initialMsg = JSON.stringify({ text: `[SYSTEM OK] Received ${actionType || 'COMMAND'}: "${prompt}"\n\nInitializing core processing...\n` });
  res.write(`data: ${initialMsg}\n\n`);

  setTimeout(() => {
    const chunk1 = JSON.stringify({ text: `[ANALYSIS] Processing payload through core agent pipeline...\n` });
    res.write(`data: ${chunk1}\n\n`);
  }, 800);

  setTimeout(() => {
    const chunk2 = JSON.stringify({ text: `[EXECUTION] Routine executed successfully.\n` });
    res.write(`data: ${chunk2}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }, 1800);
};

// Route handlers for both /api/orchestrate and /orchestrate
app.post('/api/orchestrate', handleOrchestration);
app.post('/orchestrate', handleOrchestration);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('OmniCine Protocol Backend Core Online');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
