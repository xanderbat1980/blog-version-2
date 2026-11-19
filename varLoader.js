/* Restore the original four-second fade without hiding or blocking site content. */
(() => {
  'use strict';
  const overlay = document.querySelector('#loader');
  if (!overlay) return;
  const image = overlay.querySelector('img');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let deadline;
  let started = false;
  const dismiss = () => {
    clearTimeout(deadline);
    if (overlay.contains(document.activeElement)) {
      document.querySelector('main')?.focus({ preventScroll: true });
    }
    overlay.remove();
    reducedMotion.removeEventListener('change', motionChanged);
  };
  const motionChanged = event => { if (event.matches) dismiss(); };
  if (reducedMotion.matches) { dismiss(); return; }
  reducedMotion.addEventListener('change', motionChanged);
  const show = () => {
    if (started || !overlay.isConnected) return;
    if (!image.naturalWidth) { dismiss(); return; }
    started = true;
    clearTimeout(deadline);
    overlay.hidden = false;
    overlay.classList.add('intro-running');
    // CSS can fail or be overridden; the decorative layer must always disappear.
    deadline = window.setTimeout(dismiss, 4500);
  };
  overlay.querySelector('.intro-skip').addEventListener('click', dismiss);
  overlay.addEventListener('animationend', event => {
    if (event.target === overlay && event.animationName === 'anonymous-opening') dismiss();
  });
  image.addEventListener('load', show, { once: true });
  image.addEventListener('error', dismiss, { once: true });
  window.addEventListener('pageshow', event => { if (event.persisted) dismiss(); });
  deadline = window.setTimeout(dismiss, 1500);
  if (image.complete) show();
})();
