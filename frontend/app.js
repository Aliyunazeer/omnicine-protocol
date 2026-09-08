const API_BASE_URL = 'https://omnicine-protocol.onrender.com';

async function runSystemAction(actionType, userPrompt) {
  const overlay = document.getElementById('telemetry-overlay');
  const card = document.getElementById('telemetry-card');
  const title = document.getElementById('telemetry-title');
  const body = document.getElementById('telemetry-body');
  const indicator = document.getElementById('telemetry-indicator');
  const outputConsole = document.getElementById('main-console-output');

  if (!overlay || !card || !title || !body || !indicator) return;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  if (outputConsole) {
    outputConsole.innerText = `[ORCHESTRATOR INIT] Executing ${actionType.toUpperCase()}...\n\n`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, actionType })
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
            setTimeout(closeTelemetryWindow, 3000);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text && outputConsole) {
              outputConsole.innerText += parsed.text;
              outputConsole.scrollTop = outputConsole.scrollHeight;
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    if (outputConsole) {
      outputConsole.innerText += `\n[SYSTEM FAILURE]: ${err.message}`;
    }
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

  if (btnAnalysis) btnAnalysis.onclick = () => runSystemAction('cinematic-analysis', 'Inspect color parade.');
  if (btnScript) btnScript.onclick = () => runSystemAction('script-orchestration', 'Synthesize dialogue.');
  if (btnRender) btnRender.onclick = () => runSystemAction('render-pipeline', 'Initiate render.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindUIEvents);
} else {
  bindUIEvents();
}
