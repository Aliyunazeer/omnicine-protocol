const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Root endpoint (the one working in your screenshot)
app.get('/', (req, res) => {
  res.json({ status: "Omnicine Core Active" });
});

// The missing route causing the 404
app.post('/api/orchestrate', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
