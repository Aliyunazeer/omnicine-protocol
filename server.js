const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Explicitly handle preflight OPTIONS
app.options('*', cors());

// SSE Endpoint
app.all('/api/orchestrate', (req, res) => {
  const { prompt, actionType } = req.body || {};

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

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
});

// Root Healthcheck
app.get('/', (req, res) => {
  res.json({ status: "Omnicine Core Active" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
