/* ═══════════════════════════════════════════════════
   UBA Smart Money — App Init & Handlers
   ═══════════════════════════════════════════════════ */

/* ─── Quick Save ─── */
function confirmQuickSave() {
  Sheets.close();
  Toast.showWithUndo('₦47,000 moved to Emergency Fund', () => {
    Toast.show('Transfer reversed', 'info');
  });
}

/* ─── Notifications ─── */
function markAllRead() {
  document.querySelectorAll('.notif-item--unread').forEach(el => {
    el.classList.remove('notif-item--unread');
    const dot = el.querySelector('.notif-dot');
    if (dot) dot.remove();
  });
  const sub = document.getElementById('notif-sub');
  if (sub) sub.textContent = '0 unread · all caught up';
  document.querySelectorAll('.bell-badge').forEach(b => b.style.display = 'none');
  Toast.show('All notifications marked as read', 'info');
}

/* ─── Goal icon picker ─── */
function initIconPicker(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.querySelectorAll('.icon-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.icon-pick').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
}

/* ─── Goal template chips ─── */
function initTemplateChips() {
  document.querySelectorAll('.goal-template-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.goal-template-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const nameInput = document.getElementById('new-goal-name');
      if (nameInput && chip.dataset.name) nameInput.value = chip.dataset.name;
    });
  });
}

/* ─── Create Goal ─── */
function createGoal() {
  const nameInput = document.getElementById('new-goal-name');
  const name = nameInput ? nameInput.value.trim() : 'New Goal';
  Sheets.close();
  Toast.show('Goal created — Smart Money Coach is building your plan', 'success');
}

/* ─── Generic toast shortcut ─── */
function showToast(msg, type) {
  Toast.show(msg, type || 'info');
}

/* ─── DOMContentLoaded ─── */
document.addEventListener('DOMContentLoaded', () => {
  Coach.init();
  initIconPicker('goal-icon-grid');
  initTemplateChips();
});
