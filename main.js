/* Shared enhancements. Navigation, articles and lists remain usable without JS. */
(() => {
  'use strict';
  const header = document.querySelector('#header');
  const toggle = header?.querySelector('.toggle-button');
  if (toggle) {
    const panels = [...header.querySelectorAll('.collapse')];
    const mobile = window.matchMedia('(max-width: 574px)');
    const updateMenu = (expanded = false) => {
      toggle.setAttribute('aria-expanded', String(expanded));
      panels.forEach(panel => { panel.hidden = mobile.matches && !expanded; });
    };
    header.dataset.navReady = '';
    updateMenu();
    toggle.addEventListener('click', () => updateMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    header.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        updateMenu();
        toggle.focus();
      }
    });
    mobile.addEventListener('change', () => updateMenu());
  }

  // Keep the image URL intact: restoring the actual file restores the image.
  document.querySelectorAll('img[data-missing-asset]').forEach(image => {
    const showMissing = () => {
      if (image.dataset.fallbackShown) return;
      image.dataset.fallbackShown = 'true';
      const note = document.createElement('span');
      note.className = 'missing-media';
      note.textContent = image.alt || 'Image indisponible';
      image.insertAdjacentElement('afterend', note);
      image.hidden = true;
    };
    image.addEventListener('error', showMissing, { once: true });
    if (!image.getAttribute('src') || (image.complete && image.naturalWidth === 0)) showMissing();
  });

  // CSS handles the post grid; the carousel has a scrollable CSS fallback.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    document.querySelectorAll('video[autoplay]').forEach(video => {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }
  if (typeof window.Swiper === 'function') {
    document.querySelectorAll('.swiper-container').forEach(container => {
      const carousel = new window.Swiper(container, {
        direction: 'horizontal', loop: true, slidesPerView: 2, spaceBetween: 12,
        autoplay: reducedMotion ? false : { delay: 3000, disableOnInteraction: true },
        a11y: { enabled: true }, keyboard: { enabled: true, onlyInViewport: true },
        breakpoints: { 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }
      });
      const control = document.createElement('button');
      control.type = 'button';
      control.className = 'carousel-control btn btn-primary';
      const updateControl = () => {
        control.textContent = carousel.autoplay.running ? 'Pause animation' : 'Start animation';
      };
      control.addEventListener('click', () => {
        if (carousel.autoplay.running) carousel.autoplay.stop();
        else carousel.autoplay.start();
        updateControl();
      });
      carousel.on('autoplayStop', updateControl);
      carousel.on('autoplayStart', updateControl);
      updateControl();
      container.insertAdjacentElement('afterend', control);
    });
  }

  const search = document.querySelector('#article-search');
  if (search) {
    const query = search.querySelector('#query');
    const rows = [...document.querySelectorAll('#search-results li')];
    const status = document.querySelector('#search-status');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    const filter = () => {
      const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      rows.forEach(row => {
        row.hidden = !terms.every(term => normalize(row.textContent).includes(term));
        if (!row.hidden) count++;
      });
      status.textContent = count ? `${count} article(s) trouvé(s).` : 'Aucun article trouvé. Essayez un autre mot.';
    };
    query.value = new URLSearchParams(window.location.search).get('q') || '';
    query.addEventListener('input', filter);
    search.addEventListener('submit', event => {
      event.preventDefault();
      const url = new URL(window.location.href);
      if (query.value.trim()) url.searchParams.set('q', query.value.trim());
      else url.searchParams.delete('q');
      window.history.replaceState(null, '', url);
      filter();
    });
    filter();
  }
})();
