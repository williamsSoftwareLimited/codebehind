(() => {
  // --- Background stars ---
  const starsLayer = document.getElementById('stars');
  const starCount = 160;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    const size = Math.random() * 2.4 + 0.7;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2.2 + Math.random() * 4.8}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    starsLayer.appendChild(star);
  }

  // --- Background touch: toggle .touched on body ---
  let touchTimer = null;
  document.getElementById('container').addEventListener('touchstart', () => {
    touchTimer = setTimeout(() => {
      document.body.classList.toggle('touched');
    }, 150);
  });
  document.getElementById('container').addEventListener('touchend', () => {
    clearTimeout(touchTimer);
  });
  // Keep hover working on desktop
  document.body.addEventListener('mouseenter', () => document.body.classList.add('touched'));
  document.body.addEventListener('mouseleave', () => document.body.classList.remove('touched'));

  // --- Title ticker ---
  let title = '♥︎✵☺︎☕︎♘⦿☆☽⚀⛵︎⚽︎☯︎';
  const aceOfSpades = '🂡';
  setInterval(() => {
    title = title.substring(1) + title[0];
    document.title = aceOfSpades + title;
  }, 500);

  // --- #h: click/tap to toggle fade and trigger brightness flash ---
  const h_elem = document.getElementById('h');

  // Bright flash: quick rise (0.4 s = H_RISE/1000), hold (~8 s = H_HOLD/1000),
  // slow fade (2 s = H_FADE/1000) ≈ 10 s total.
  // The duration strings below must stay in sync with H_RISE / H_FADE in the
  // module script above (cross-script constants can't be shared directly).
  let _hBrightTimer = null;
  function triggerBright() {
    if (_hBrightTimer) { clearTimeout(_hBrightTimer); _hBrightTimer = null; }
    h_elem.style.transition = 'color 0.4s ease-in, text-shadow 0.4s ease-in';   // H_RISE
    h_elem.classList.add('bright');
    window._hPressTime = Date.now();
    _hBrightTimer = setTimeout(() => {
      h_elem.style.transition = 'color 2s ease-out, text-shadow 2s ease-out';   // H_FADE
      h_elem.classList.remove('bright');
      _hBrightTimer = null;
    }, 8000); // H_HOLD
  }

  function toggleH() {
    triggerBright();
    if (h_elem.classList.contains('fade-in')) {
      h_elem.classList.replace('fade-in', 'fade-out');
    } else {
      h_elem.classList.replace('fade-out', 'fade-in');
    }
  }
  h_elem.addEventListener('click', toggleH);
  h_elem.addEventListener('touchend', e => { e.preventDefault(); toggleH(); });

  // --- #end: tap/click to trigger wobble ---
  const end = document.getElementById('end');
  function triggerEnd() {
    end.classList.remove('wobbling');
    // Force reflow so animation restarts
    void end.offsetWidth;
    end.classList.add('wobbling');
  }
  end.addEventListener('click', triggerEnd);
  end.addEventListener('touchend', e => { e.preventDefault(); triggerEnd(); });
  end.addEventListener('animationend', () => end.classList.remove('wobbling'));

})();
