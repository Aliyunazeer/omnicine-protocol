const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000' 
  : 'https://omnicine-protocol.onrender.com';

const ACTION_TEMPLATES = {
  'cinematic-analysis': {
    title: 'SYS// CINEMATIC SPECTRUM ANALYZER',
    borderColor: 'border-cyan-500/40',
    indicatorColor: 'bg-cyan-500',
    html: `
      <div class="w-full flex flex-col gap-1.5">
        <div class="flex justify-between text-[10px] text-cyan-400 font-mono">
          <span>SPECTRAL PARADE</span>
          <span>REC.2020 ACTIVE</span>
        </div>
        <div class="flex items-end gap-1 h-8 w-full bg-black/80 p-1 rounded border border-neutral-800">
          <div class="bg-cyan-500/80 w-1/5 h-2/3 animate-pulse"></div>
          <div class="bg-blue-500/80 w-1/5 h-full animate-pulse delay-75"></div>
          <div class="bg-indigo-500/80 w-1/5 h-1/2 animate-pulse delay-150"></div>
          <div class="bg-neutral-400/80 w-1/5 h-4/5 animate-pulse delay-100"></div>
          <div class="bg-cyan-400/80 w-1/5 h-3/4 animate-pulse"></div>
        </div>
      </div>
    `
  },
  'script-orchestration': {
    title: 'SYS// AGENTIC SCRIPT SYNTHESIS',
    borderColor: 'border-emerald-500/40',
    indicatorColor: 'bg-emerald-500',
    html: `
      <div class="w-full flex flex-col gap-2">
        <div class="flex justify-between text-[10px] text-emerald-400 font-mono">
          <span>PARSING SCENE STRUCTURE</span>
          <span id="telemetry-rate">142 TOK/S</span>
        </div>
        <div class="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
          <div class="bg-emerald-500 h-full w-2/3 animate-pulse"></div>
        </div>
      </div>
    `
  },
  'render-pipeline': {
    title: 'SYS// MONOCHROME RENDER PIPELINE',
    borderColor: 'border-neutral-300/40',
    indicatorColor: 'bg-white',
    html: `
      <div class="w-full flex items-center gap-3">
        <div class="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div class="flex flex-col text-[10px] font-mono">
          <span class="text-neutral-200">RAYTRACING MATRIX: ACTIVE</span>
          <span class="text-neutral-500">FRAME ORCHESTRATION</span>
        </div>
      </div>
    `
  }
};

async function runSystemAction(actionType, userPrompt) {
  const overlay = document.getElementById('telemetry-overlay');
  const card = document.getElementById('telemetry-card');
  const title = document.getElementById('telemetry-title');
  const body = document.getElementById('telemetry-body');
  const indicator = document.getElementById('telemetry-indicator');
  const outputConsole = document.getElementById('main-console-output');

  if (!overlay || !card || !title || !body || !indicator) return;

  const template = ACTION_TEMPLATES[actionType] || ACTION_TEMPLATES['script-orchestration'];
  
  title.innerText = template.title;
  body.innerHTML = template.html;
  indicator.className = `w-2 h-2 rounded-full animate-pulse ${template.indicatorColor}`;
  card.className = `bg-black/90 border ${template.borderColor} rounded-lg p-4 shadow-2xl backdrop-blur-md text-xs text-neutral-300 relative overflow-hidden transition-all duration-300`;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');

  if (outputConsole) {
    outputConsole.innerText = `[ORCHESTRATOR INIT] Executing ${actionType.toUpperCase()}...\n\n`;
  }

  try {
    let response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt, actionType })
    });

    if (response.status === 404) {
      // Fallback try without /api prefix if 404 occurs
      response = await fetch(`${API_BASE_URL}/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, actionType })
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
            indicator.classList.remove('animate-pulse');
            indicator.classList.add('bg-neutral-600');
            title.innerText += ' [COMPLETE]';
            setTimeout(closeTelemetryWindow, 4000);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.text && outputConsole) {
              outputConsole.innerText += parsed.text;
              outputConsole.scrollTop = outputConsole.scrollHeight;
            }
            if (parsed.error && outputConsole) {
              outputConsole.innerText += `\n[ERROR]: ${parsed.error}`;
            }
          } catch (e) {}
        }
      }
    }
  } catch (err) {
    console.error('System Action Failed:', err);
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
  const runBtn = document.getElementById('runBtn');
  const agentInput = document.getElementById('agentPrompt');

  if (btnAnalysis) {
    btnAnalysis.onclick = () => {
      runSystemAction('cinematic-analysis', 'Execute high-contrast cinematic color lighting analysis for Scene 01.');
    };
  }

  if (btnScript) {
    btnScript.onclick = () => {
      runSystemAction('script-orchestration', 'Synthesize agentic multi-character dialogue block for act 2 climax.');
    };
  }

  if (btnRender) {
    btnRender.onclick = () => {
      runSystemAction('render-pipeline', 'Initiate monochrome render sequence specs for camera rig angle B.');
    };
  }

  if (runBtn && agentInput) {
    runBtn.onclick = () => {
      const promptText = agentInput.value.trim();
      if (promptText) {
        runSystemAction('script-orchestration', promptText);
      }
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindUIEvents);
} else {
  bindUIEvents();
}
