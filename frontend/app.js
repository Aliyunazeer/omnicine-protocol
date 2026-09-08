const API_BASE_URL = 'https://omnicine-protocol.onrender.com';

const ACTION_CONFIG = {
  'cinematic-analysis': {
    title: 'SYS// CINEMATIC ANALYSIS PIPELINE',
    prompt: 'Inspect color parade, REC.2020 grading curves, and frame density.',
    initialLog: 'Initializing REC.2020 Color Curve Analyzer...'
  },
  'script-orchestration': {
    title: 'SYS// SCRIPT SYNTHESIS ENGINE',
    prompt: 'Synthesize multi-character dialogue block and climax structure.',
    initialLog: 'Parsing agentic dialogue nodes & climax cadence...'
  },
  'render-pipeline': {
    title: 'SYS// MONOCHROME RENDER PIPELINE',
    prompt: 'Initiate monochrome render sequence and monitor raytracing matrices.',
    initialLog: 'Syncing raytracing matrices and render node clusters...'
  }
};

async function runSystemAction(actionType, customPrompt) {
  const config = ACTION_CONFIG[actionType] || {
    title: `SYS// ${actionType.toUpperCase()}`,
    prompt: customPrompt || 'Executing routine...',
    initialLog: 'Initiating telemetry sequence...'
  };

  const overlay = document.getElementById('telemetry-overlay');
  const titleElem = document.getElementById('telemetry-title');
  const bodyElem = document.getElementById('telemetry-body');
  const outputConsole = document.getElementById('main-console-output');

  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  if (titleElem) {
    titleElem.innerText = config.title;
  }

  // Clear previous outputs or append fresh header
  if (bodyElem) {
    bodyElem.innerText = `[STREAM INIT] ${config.initialLog}\n> PROMPT: "${config.prompt}"\n\n`;
  }

  if (outputConsole) {
    outputConsole.innerText += `\n\n[ORCHESTRATOR INIT] Executing ${actionType.toUpperCase()}...\n`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: config.prompt, actionType })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') {
            if (bodyElem) bodyElem.innerText += `\n[STATUS]: TASK COMPLETE`;
            setTimeout(closeTelemetryWindow, 4000);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              if (bodyElem) {
                bodyElem.innerText += parsed.text;
                bodyElem.scrollTop = bodyElem.scrollHeight;
              }
              if (outputConsole) {
                outputConsole.innerText += parsed.text;
                outputConsole.scrollTop = outputConsole.scrollHeight;
              }
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    const errText = `\n[SYSTEM FAILURE]: ${err.message}`;
    if (bodyElem) bodyElem.innerText += errText;
    if (outputConsole) outputConsole.innerText += errText;
  }
}

function closeTelemetryWindow() {
  const overlay = document.getElementById('telemetry-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }
}

function bindUIEvents() {
  const btnAnalysis = document.getElementById('btn-cinematic-analysis');
  const btnScript = document.getElementById('btn-script-orchestration');
  const btnRender = document.getElementById('btn-render-pipeline');
  const closeBtn = document.getElementById('telemetry-close');

  if (btnAnalysis) btnAnalysis.onclick = () => runSystemAction('cinematic-analysis');
  if (btnScript) btnScript.onclick = () => runSystemAction('script-orchestration');
  if (btnRender) btnRender.onclick = () => runSystemAction('render-pipeline');
  if (closeBtn) closeBtn.onclick = closeTelemetryWindow;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindUIEvents);
} else {
  bindUIEvents();
}
