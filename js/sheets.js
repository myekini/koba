/* ═══════════════════════════════════════════════════
   UBA Smart Money — Bottom Sheet Manager
   ═══════════════════════════════════════════════════ */

const Sheets = (() => {

  let _current = null;

  function open(id) {
    close(); // close any open sheet first
    const sheet    = document.getElementById(id);
    const backdrop = document.getElementById('sheet-backdrop');
    if (!sheet || !backdrop) return;
    backdrop.classList.add('open');
    sheet.classList.add('open');
    _current = sheet;
  }

  function close() {
    const backdrop = document.getElementById('sheet-backdrop');
    if (backdrop) backdrop.classList.remove('open');
    if (_current) { _current.classList.remove('open'); _current = null; }
  }

  function openGoalDetail(goalId) {
    const goal = DATA.goals.find(g => g.id === goalId);
    if (!goal) return;

    // Populate goal detail sheet
    document.getElementById('gd-name').textContent    = goal.name;
    document.getElementById('gd-status').textContent  = goal.status === 'on-track' ? 'On track' : goal.status === 'at-risk' ? 'At risk' : 'Stalled';
    document.getElementById('gd-saved').textContent   = DATA.fmt.currency(goal.saved);
    document.getElementById('gd-target').textContent  = DATA.fmt.currency(goal.target);
    document.getElementById('gd-pct').textContent     = goal.pct + '%';
    document.getElementById('gd-deadline').textContent = goal.deadline;
    document.getElementById('gd-monthly').textContent = DATA.fmt.currency(goal.monthlyContrib) + '/mo';
    document.getElementById('gd-recommended').textContent = DATA.fmt.currency(goal.recommendedContrib) + '/mo';

    // Contributions list
    const contribList = document.getElementById('gd-contribs');
    contribList.innerHTML = goal.contributions.map(c => `
      <div class="goal-contrib-item">
        <span class="goal-contrib-date">${c.date}</span>
        <span class="goal-contrib-amount">+${DATA.fmt.currency(c.amount)}</span>
      </div>
    `).join('');

    // Coach link
    const coachBtn = document.getElementById('gd-coach-link');
    if (coachBtn) {
      coachBtn.onclick = () => {
        close();
        Coach.ask('Tell me about my ' + goal.name + ' goal');
      };
    }

    open('sheet-goal-detail');
  }

  /* ESC key to close */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* Expose globally */
  window.Sheets = { open, close, openGoalDetail };

  return { open, close, openGoalDetail };

})();
