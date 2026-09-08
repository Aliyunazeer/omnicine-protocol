const API_BASE_URL = 'https://omnicine-protocol.onrender.com';

let activeAction = null;
let intervalId = null;

const ACTION_MAP = {
  'cinematic-analysis': {
    title: 'CINEMATIC ANALYSIS // LUMA PARADE',
    vizId: 'viz-cinematic-analysis'
  },
  'script-orchestration': {
    title: 'SCRIPT SYNTHESIS // CADENCE GRAPH',
    vizId: 'viz-script-orchestration'
  },
  'render-pipeline': {
    title: 'RENDER PIPELINE // RAYTRACING TILES',
    vizId: 'viz-render-pipeline'
  }
};

function startActionRoutine(actionType) {
  // If an action is already running, kill it first
  if (activeAction) {
    stopActiveAction();
  }

  activeAction = actionType;
  
  // UI Element references
  const overlay = document.getElementById('telemetry-overlay');
  const titleElem = document.getElementById('telemetry-title');
  const bodyElem = document.getElementById('telemetry-body');
  const badge = document.getElementById(`badge-${actionType}`);
  const button = document.getElementById(`btn-${actionType}`);
  const outputConsole = document.getElementById('main-console-output');

  // Update button & badge UI
  if (badge) {
    badge.innerText = 'ACTIVE';
    badge.className = 'text-[10px] text-emerald-400 font-bold uppercase border border-emerald-500/50 px-1.5 py-0.5 rounded bg-emerald-950/40 animate-pulse';
  }
  if (button) {
    button.innerText = 'KILL ROUTINE';
    button.className = 'w-full py-1.5 text-xs font-semibold bg-red-900 hover:bg-red-800 text-red-200 rounded transition';
  }

  // Show correct Visualizer Chart
  Object.values(ACTION_MAP).forEach(cfg => {
    const vEl = document.getElementById(cfg.vizId);
    if (vEl) vEl.classList.add('hidden');
  });

  const activeCfg = ACTION_MAP[actionType];
  if (activeCfg) {
    const activeViz = document.getElementById(activeCfg.vizId);
    if (activeViz) activeViz.classList.remove('hidden');
    if (titleElem) titleElem.innerText = activeCfg.title;
  }

  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  if (bodyElem) {
    bodyElem.innerText = `[PERPETUAL ENGINE INIT] Routine ${actionType} engaged.\nStarting continuous stream...\n`;
  }

  if (outputConsole) {
    outputConsole.innerText += `\n[ACTION STARTED]: ${actionType.toUpperCase()} routine initialized in endless loop mode.`;
    outputConsole.scrollTop = outputConsole.scrollHeight;
  }

  // Start continuous simulation loop
  intervalId = setInterval(() => {
    updateVisualizerData(actionType);
    appendStreamLog(actionType);
  }, 1000);
}

function stopActiveAction() {
  if (!activeAction) return;

  const currentAction = activeAction;
  clearInterval(intervalId);
  intervalId = null;

  // Restore badge and button UI
  const badge = document.getElementById(`badge-${currentAction}`);
  const button = document.getElementById(`btn-${currentAction}`);
  const overlay = document.getElementById('telemetry-overlay');
  const outputConsole = document.getElementById('main-console-output');

  if (badge) {
    badge.innerText = 'IDLE';
    badge.className = 'text-[10px] text-zinc-500 uppercase border border-zinc-800 px-1.5 py-0.5 rounded';
  }
  if (button) {
    button.innerText = 'START ROUTINE';
    button.className = 'w-full py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-emerald-600 text-white rounded transition';
  }

  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  if (outputConsole) {
    outputConsole.innerText += `\n[ACTION TERMINATED]: ${currentAction.toUpperCase()} routine terminated by user.`;
    outputConsole.scrollTop = outputConsole.scrollHeight;
  }

  activeAction = null;
}

// Dynamic chart visual updates
function updateVisualizerData(actionType) {
  if (actionType === 'cinematic-analysis') {
    for (let i = 1; i <= 12; i++) {
      const bar = document.getElementById(`bar-${i}`);
      if (bar) {
        const randHeight = Math.floor(Math.random() * 85) + 15;
        bar.style.height = `${randHeight}%`;
      }
    }
    const luma = document.getElementById('luma-val');
    if (luma) luma.innerText = `${(Math.random() * 20 + 80).toFixed(1)}%`;
  } else if (actionType === 'script-orchestration') {
    const nodes = ['node-1', 'node-2', 'node-3'];
    const activeIndex = Math.floor(Math.random() * nodes.length);
    nodes.forEach((nId, idx) => {
      const el = document.getElementById(nId);
      if (el) {
        if (idx === activeIndex) {
          el.className = 'w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-300 font-bold bg-emerald-900 animate-pulse';
        } else {
          el.className = 'w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold bg-zinc-900';
        }
      }
    });
  } else if (actionType === 'render-pipeline') {
    const grid = document.getElementById('matrix-grid');
    if (grid) {
      const tiles = grid.children;
      for (let i = 0; i < tiles.length; i++) {
        if (Math.random() > 0.4) {
          tiles[i].className = 'bg-emerald-500/30 border border-emerald-400/60 rounded transition-colors duration-200';
        } else {
          tiles[i].className = 'bg-zinc-900 border border-zinc-800 rounded transition-colors duration-200';
        }
      }
    }
  }
}

function appendStreamLog(actionType) {
  const bodyElem = document.getElementById('telemetry-body');
  if (!bodyElem) return;

  const logs = {
    'cinematic-analysis': [
      '[PARADE]: REC.2020 luminance balance optimal.',
      '[VISION]: Sampling gamut saturation across keyframes.',
      '[GRADIENT]: Gamma 2.4 curve alignment verified.'
    ],
    'script-orchestration': [
      '[AGENT]: Synthesizing dialogue pacing for Act II climax.',
      '[CADENCE]: Subtext density check: 94% narrative match.',
      '[NODE]: Re-routing emotional tension parameters.'
    ],
    'render-pipeline': [
      '[RAYTRACE]: Tile batch #4092 rendered (84ms).',
      '[MATRIX]: GPU cluster yield holding at 99.4%.',
      '[BUFFER]: Flushing frame cache to monochrome buffer.'
    ]
  };

  const pool = logs[actionType] || ['[STREAM]: Active cycle pulse...'];
  const randomMsg = pool[Math.floor(Math.random() * pool.length)];

  bodyElem.innerText += `${randomMsg}\n`;
  bodyElem.scrollTop = bodyElem.scrollHeight;
}

function bindUIEvents() {
  ['cinematic-analysis', 'script-orchestration', 'render-pipeline'].forEach(actionType => {
    const btn = document.getElementById(`btn-${actionType}`);
    if (btn) {
      btn.onclick = () => {
        if (activeAction === actionType) {
          stopActiveAction();
        } else {
          startActionRoutine(actionType);
        }
      };
    }
  });

  const killBtn = document.getElementById('telemetry-close');
  if (killBtn) {
    killBtn.onclick = stopActiveAction;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindUIEvents);
} else {
  bindUIEvents();
}
