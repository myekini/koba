/* ═══════════════════════════════════════════════════
   UBA Smart Money — Snackbar / Toast
   ═══════════════════════════════════════════════════ */

const Toast = (() => {

  let _timer = null;

  function show(message, type = 'success') {
    const el = document.getElementById('snackbar');
    if (!el) return;
    el.innerHTML = message;
    el.className = `snackbar snackbar--${type} open`;
    clearTimeout(_timer);
    _timer = setTimeout(() => el.classList.remove('open'), 3200);
  }

  function showWithUndo(message, undoFn) {
    const el = document.getElementById('snackbar');
    if (!el) return;
    el.className = 'snackbar snackbar--success snackbar--action open';
    el.innerHTML = `<span>${message}</span>`;

    const undoBtn = document.createElement('button');
    undoBtn.className = 'snackbar-undo';
    undoBtn.textContent = 'Undo';
    undoBtn.onclick = () => {
      clearTimeout(_timer);
      el.classList.remove('open');
      if (typeof undoFn === 'function') undoFn();
      setTimeout(() => Toast.show('Action undone', 'info'), 200);
    };
    el.appendChild(undoBtn);

    clearTimeout(_timer);
    _timer = setTimeout(() => el.classList.remove('open'), 5000);
  }

  /* Expose globally */
  window.Toast = { show, showWithUndo };

  return { show, showWithUndo };

})();
