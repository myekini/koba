/* ═══════════════════════════════════════════════════
   UBA Smart Money — AI Coach Chat
   ═══════════════════════════════════════════════════ */

const Coach = (() => {

  let _initialised = false;

  function init() {
    if (_initialised) return;
    _initialised = true;
    const input = document.getElementById('coach-input');
    if (!input) return;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  function send() {
    const input = document.getElementById('coach-input');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    _submitMessage(val);
  }

  function sendChip(text, chipEl) {
    if (chipEl) chipEl.remove(); // remove chip so it's not re-tapped
    _submitMessage(text);
  }

  function ask(text) {
    /* Called from other pages — navigate to Coach then inject message */
    Sheets.close();
    Navigation.switchPage('coach');
    setTimeout(() => _submitMessage(text), 200);
  }

  function _submitMessage(text) {
    _removeEmptyState();
    _appendMsg(text, 'user');
    _showTyping();
    const delay = 1200 + Math.random() * 500;
    setTimeout(() => {
      _removeTyping();
      const response = _getResponse(text);
      _appendMsg(response, 'ai');
    }, delay);
  }

  function _getResponse(text) {
    /* Try exact match first */
    if (DATA.coachResponses[text]) return DATA.coachResponses[text];
    /* Loose keyword matching */
    const t = text.toLowerCase();
    if (t.includes('food') || t.includes('spending'))
      return DATA.coachResponses['Why is my food spending so high this month?'];
    if (t.includes('vacation') || t.includes('goal') || t.includes('faster'))
      return DATA.coachResponses['How do I hit my vacation goal faster?'];
    if (t.includes('afford') || t.includes('purchase') || t.includes('buy'))
      return DATA.coachResponses['Can I afford a ₦50,000 purchase?'];
    if (t.includes('debt') || t.includes('loan') || t.includes('repay'))
      return DATA.coachResponses['Show me a debt repayment plan'];
    if (t.includes('plan') || t.includes('save') || t.includes('budget'))
      return DATA.coachResponses['Build me a savings plan'];
    /* Generic fallback */
    return `<p>Based on your May transaction data, here is what I can see about <em>"${text}"</em>:</p>
            <p>Your current financial health score is <strong>72/100</strong> — improving. Your savings rate is up to <strong>13%</strong> this month. Keep asking and I will keep tailoring the analysis to your UBA accounts.</p>`;
  }

  function _appendMsg(html, role) {
    const win = document.getElementById('coach-window');
    if (!win) return;
    const div = document.createElement('div');
    div.className = `msg msg--${role}`;
    if (role === 'user') {
      div.innerHTML = `
        <div class="msg-avatar msg-avatar--user">${DATA.user.initials}</div>
        <div class="msg-bubble msg-bubble--user"><p>${html}</p></div>`;
    } else {
      div.innerHTML = `
        <div class="msg-avatar msg-avatar--ai">U</div>
        <div class="msg-bubble msg-bubble--ai">${html}</div>`;
    }
    win.appendChild(div);
    /* Scroll new message into view within the screen container */
    const screen = document.getElementById('screen-sm');
    if (screen) setTimeout(() => screen.scrollTop = screen.scrollHeight, 50);
  }

  let _typingEl = null;
  function _showTyping() {
    const win = document.getElementById('coach-window');
    if (!win) return;
    _typingEl = document.createElement('div');
    _typingEl.className = 'msg msg--ai';
    _typingEl.id = 'typing-indicator';
    _typingEl.innerHTML = `
      <div class="msg-avatar msg-avatar--ai">U</div>
      <div class="msg-bubble msg-bubble--ai" style="padding:12px 16px;">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>`;
    win.appendChild(_typingEl);
    const screen = document.getElementById('screen-sm');
    if (screen) screen.scrollTop = screen.scrollHeight;
  }

  function _removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
    _typingEl = null;
  }

  function _removeEmptyState() {
    const empty = document.querySelector('#coach-window .coach-empty');
    if (empty) empty.remove();
    const chips = document.querySelector('#coach-window .coach-empty-chips');
    if (chips) chips.remove();
  }

  /* Expose globals */
  window.Coach = { init, send, sendChip, ask };

  return { init, send, sendChip, ask };

})();
