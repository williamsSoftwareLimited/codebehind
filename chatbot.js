(() => {
  const pacmanTrigger = document.getElementById('pacman-trigger');
  const chatModal = document.getElementById('chat-modal');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatLog = document.getElementById('chat-log');

  if (!pacmanTrigger || !chatModal || !chatClose || !chatForm || !chatInput || !chatLog) return;

  const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const BOT_RESPONSE_DELAY_MS = 240;
  let chatReturnFocusEl = null;

  const botReply = (text) => {
    const content = String(text).toLowerCase();
    const words = new Set(content.match(/\b[a-z0-9']+\b/g) || []);
    const hasWord = (word) => words.has(word);

    let returnTxt = '';
    const response = fetch('claude.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    }).then(console.log);

    //const data = await response.json();
    //console.log(data.content[0].text);

    if (hasWord('hello') || hasWord('hi')) return 'HELLO HUMAN. SYSTEM STATUS: ONLINE.';
    if (hasWord('help')) return 'AVAILABLE COMMANDS: HELLO, HELP, GAME, STATUS.';
    if (hasWord('game')) return 'A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.';
    if (hasWord('status')) return 'ALL SYSTEMS NOMINAL. DEFCON LEVEL: GREEN.';
    return 'INPUT RECEIVED. PROCESSING COMPLETE.';
  };

  const appendLine = (prefix, text) => {
    const item = document.createElement('li');
    item.textContent = `> ${prefix}: ${text}`;
    chatLog.appendChild(item);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const openChat = () => {
    chatReturnFocusEl = document.activeElement;
    chatModal.classList.add('open');
    requestAnimationFrame(() => chatInput.focus());
  };

  const closeChat = () => {
    chatModal.classList.remove('open');
    if (chatReturnFocusEl) {
      chatReturnFocusEl.focus();
    } else {
      pacmanTrigger.focus();
    }
  };

  pacmanTrigger.addEventListener('click', openChat);
  chatClose.addEventListener('click', closeChat);
  chatModal.addEventListener('click', (e) => {
    if (e.target === chatModal) closeChat();
  });

  document.addEventListener('keydown', (e) => {
    if (!chatModal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeChat();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = chatModal.querySelectorAll(FOCUSABLE_SELECTOR);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatInput.value.trim();
    if (!input) return;
    appendLine('YOU', input);
    chatInput.value = '';
    setTimeout(() => appendLine('JOSHUA', botReply(input)), BOT_RESPONSE_DELAY_MS);
  });
})();
