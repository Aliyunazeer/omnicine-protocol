let activeAction = null;
let intervalId = null;

const ALL_ACTIONS = {
  'cinematic-analysis': { title: 'PRIMARY // CINEMATIC ANALYSIS', vizId: 'viz-cinematic-analysis' },
  'script-orchestration': { title: 'PRIMARY // SCRIPT SYNTHESIS', vizId: 'viz-script-orchestration' },
  'render-pipeline': { title: 'PRIMARY // RENDER PIPELINE', vizId: 'viz-render-pipeline' },
  'frame-interp': { title: 'AUX // FRAME INTERPOLATION', vizId: 'viz-auxiliary' },
  'spatial-audio': { title: 'AUX // SPATIAL AUDIO DYNAMICS', vizId: 'viz-auxiliary' },
  'metadata-extract': { title: 'AUX // EXIF GEOMETRY EXTRACTOR', vizId: 'viz-auxiliary' },
  'prompt-refiner': { title: 'AUX // PROMPT REFINER AGENT', vizId: 'viz-auxiliary' }
};

function startActionRoutine(actionType) {
  if (activeAction) stopActiveAction();

  activeAction = actionType;
  const cfg = ALL_ACTIONS[actionType];

  const overlay = document.getElementById('telemetry-overlay');
  const titleElem = document.getElementById('telemetry-title');
  const bodyElem = document.getElementById('telemetry-body');
  const badge = document.getElementById(`badge-${actionType}`);
  const button = document.getElementById(`btn-${actionType}`);
  const outputConsole = document.getElementById('main-console-output');

  if (badge) {
    badge.innerText = 'ACTIVE';
    badge.className = 'text-[9px] text-emerald-400 font-bold uppercase border border-emerald-500/50 px-1 py-0.5 rounded bg-emerald-950/40 animate-pulse';
  }
  if (button) {
    button.innerText = 'KILL';
    button.className = button.className.replace('bg-zinc-800 hover:bg-emerald-600', 'bg-red-900 hover:bg-red-800 text-red-200');
  }

  // Hide all viz cards then show active
  document.querySelectorAll('#visualizer-container > div').forEach(el => el.classList.add('hidden'));
  const activeViz = document.getElementById(cfg.vizId);
  if (activeViz) activeViz.classList.remove('hidden');

  if (titleElem) titleElem.innerText = cfg.title;
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  if (bodyElem) bodyElem.innerText = `[PERPETUAL ENGINE INIT] Routine ${actionType} engaged.\n`;
  if (outputConsole) {
    outputConsole.innerText += `\n[ACTION ENGAGED]: ${actionType.toUpperCase()}`;
    outputConsole.scrollTop = outputConsole.scrollHeight;
  }

  intervalId = setInterval(() => {
    updateVisualizers(actionType);
    appendLogs(actionType);
  }, 900);
}

function stopActiveAction() {
  if (!activeAction) return;

  const currentAction = activeAction;
  clearInterval(intervalId);
  intervalId = null;

  const badge = document.getElementById(`badge-${currentAction}`);
  const button = document.getElementById(`btn-${currentAction}`);
  const overlay = document.getElementById('telemetry-overlay');

  if (badge) {
    badge.innerText = 'IDLE';
    badge.className = 'text-[9px] text-zinc-500 border border-zinc-800 px-1 rounded';
  }
  if (button) {
    button.innerText = 'START';
    button.className = button.className.replace('bg-red-900 hover:bg-red-800 text-red-200', 'bg-zinc-800 hover:bg-emerald-600 text-white');
  }

  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  activeAction = null;
}

function updateVisualizers(actionType) {
  if (actionType === 'cinematic-analysis') {
    for (let i = 1; i <= 12; i++) {
      const b = document.getElementById(`bar-${i}`);
      if (b) b.style.height = `${Math.floor(Math.random() * 85) + 15}%`;
    }
  } else if (actionType === 'script-orchestration') {
    ['node-1', 'node-2', 'node-3'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = (idx === Math.floor(Math.random() * 3))
          ? 'w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-300 font-bold bg-emerald-900 animate-pulse'
          : 'w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-bold bg-zinc-900';
      }
    });
  } else if (actionType === 'render-pipeline') {
    const grid = document.getElementById('matrix-grid');
    if (grid) {
      Array.from(grid.children).forEach(tile => {
        tile.className = Math.random() > 0.4
          ? 'bg-emerald-500/30 border border-emerald-400/60 rounded'
          : 'bg-zinc-900 border border-zinc-800 rounded';
      });
    }
  } else {
    // Aux Bar Meter animation
    const auxBar = document.getElementById('aux-bar');
    const auxLabel = document.getElementById('aux-label');
    if (auxBar) auxBar.style.width = `${Math.floor(Math.random() * 80) + 20}%`;
    if (auxLabel) auxLabel.innerText = `${actionType.toUpperCase()} PROCESS`;
  }
}

function appendLogs(actionType) {
  const body = document.getElementById('telemetry-body');
  if (!body) return;
  body.innerText += `[${actionType.toUpperCase()}]: Telemetry frame sync OK (${Math.floor(Math.random() * 30 + 10)}ms)\n`;
  body.scrollTop = body.scrollHeight;
}

function bindUIEvents() {
  Object.keys(ALL_ACTIONS).forEach(act => {
    const btn = document.getElementById(`btn-${act}`);
    if (btn) {
      btn.onclick = () => {
        if (activeAction === act) stopActiveAction();
        else startActionRoutine(act);
      };
    }
  });

  const killBtn = document.getElementById('telemetry-close');
  if (killBtn) killBtn.onclick = stopActiveAction;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindUIEvents);
} else {
  bindUIEvents();
}
