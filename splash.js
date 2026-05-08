(function () {
  'use strict';

  const PAGE_LABELS = {
    'dashboard.html':  'Dashboard',
    'budget.html':     'Budget',
    'itinerary.html':  'Itinerary',
    'Itinerary1.html': 'Itinerary',
    'Itinerary2.html': 'Itinerary',
    'packing.html':    'Packing',
    'places.html':     'Places',
    'settings.html':   'Settings',
    'navbar.html':     'Navigation',
  };

  function getLabel() {
    const file = window.location.pathname.split('/').pop() || 'dashboard.html';
    return PAGE_LABELS[file] || 'Voyage';
  }

  function mountSplash() {
    const label = getLabel();

    const splash = document.createElement('div');
    splash.id = 'voyage-splash';
    splash.innerHTML = `
      <div class="splash-inner">
        <div class="splash-line"></div>
        <div class="splash-label">${label}</div>
        <div class="splash-dot"></div>
      </div>
    `;

    document.body.classList.add('splash-active');
    document.body.prepend(splash);
    return splash;
  }

  function removeSplash(splash) {
    splash.classList.add('exiting');
    document.body.classList.remove('splash-active');
    splash.addEventListener('animationend', () => splash.remove(), { once: true });
    // Safety fallback
    setTimeout(() => splash.remove(), 400);
  }

  const splash = mountSplash();

  const MIN_SHOW = 550;
  const start = Date.now();

  function tryExit() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, MIN_SHOW - elapsed);
    setTimeout(() => removeSplash(splash), wait);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryExit, { once: true });
  } else {
    tryExit();
  }
})();
