/* ═══════════════════════════════════════════════════
   UBA Smart Money — Navigation
   ═══════════════════════════════════════════════════ */

const Navigation = (() => {

  const SM_PAGES = ['overview', 'coach', 'goals', 'insights', 'settings'];

  function enterSmartMoney() {
    const home = document.getElementById('screen-uba-home');
    const sm   = document.getElementById('screen-sm');
    home.classList.add('hidden');
    sm.classList.remove('hidden');
    sm.classList.add('screen-enter');
    sm.scrollTop = 0;
    setTimeout(() => sm.classList.remove('screen-enter'), 250);
    switchPage('overview');
  }

  function exitSmartMoney() {
    document.getElementById('screen-sm').classList.add('hidden');
    document.getElementById('screen-uba-home').classList.remove('hidden');
  }

  function switchPage(id) {
    SM_PAGES.forEach(p => {
      const page = document.getElementById('sm-page-' + p);
      const pill = document.getElementById('pill-' + p);
      const isActive = p === id;
      if (page) page.classList.toggle('active', isActive);
      if (pill) pill.classList.toggle('active', isActive);
    });
    // Scroll to top of screen
    const sm = document.getElementById('screen-sm');
    if (sm) sm.scrollTop = 0;
  }

  /* Expose for global onclick usage */
  window.enterSmartMoney = enterSmartMoney;
  window.exitSmartMoney  = exitSmartMoney;
  window.switchPage      = switchPage;

  return { enterSmartMoney, exitSmartMoney, switchPage };

})();
