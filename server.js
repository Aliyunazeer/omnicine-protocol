const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: '*', allowedHeaders: '*' }));
app.use(express.json());

const handleOrchestration = (req, res) => {
  const { prompt, actionType } = req.body || {};

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const initialMsg = JSON.stringify({ 
    text: `[SYSTEM OK] Received ${actionType || 'COMMAND'}: "${prompt || 'Default execution'}"\n\nInitializing core processing...\n` 
  });
  res.write(`data: ${initialMsg}\n\n`);

  setTimeout(() => {
    const chunk1 = JSON.stringify({ text: `[ANALYSIS] Processing payload through core agent pipeline...\n` });
    res.write(`data: ${chunk1}\n\n`);
  }, 600);

  setTimeout(() => {
    const chunk2 = JSON.stringify({ text: `[EXECUTION] Routine executed successfully.\n` });
    res.write(`data: ${chunk2}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }, 1400);
};

// Route matching for all potential endpoint targets
app.all('/api/orchestrate', handleOrchestration);
app.all('/orchestrate', handleOrchestration);

app.get('/', (req, res) => {
  res.status(200).send('OmniCine Protocol Backend Core Online');
});

app.listen(PORT, () => {
  console.log(`[OMNICINE BACKEND] Server listening on port ${PORT}`);
});
