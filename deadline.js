/* Preserve the animation without jQuery or overlapping repeating timers. */
(() => {
  'use strict';
  const deadline = document.querySelector('#deadline');
  if (!deadline || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const duration = 20000;
  const days = 7;
  const arm = deadline.querySelector('#designer-arm-grop');
  deadline.querySelectorAll('#progress-time-fill, #death-group').forEach(element => {
    element.style.animationDuration = `${duration / 1000}s`;
  });
  const started = performance.now();
  let pausedAt = null;
  let pausedDuration = 0;
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'deadline-control btn btn-primary';
  control.textContent = 'Pause animation';
  control.addEventListener('click', () => {
    if (pausedAt === null) {
      pausedAt = performance.now();
      deadline.dataset.animationPaused = '';
      control.textContent = 'Resume animation';
    } else {
      pausedDuration += performance.now() - pausedAt;
      pausedAt = null;
      delete deadline.dataset.animationPaused;
      control.textContent = 'Pause animation';
    }
  });
  document.body.append(control);
  const update = () => {
    if (pausedAt !== null) return;
    const elapsed = (performance.now() - started - pausedDuration) % duration;
    const remaining = days - Math.floor(elapsed / (duration / days));
    deadline.querySelectorAll('.deadline-days .day').forEach(day => { day.textContent = remaining; });
    if (arm) {
      const speed = elapsed >= 15000 ? 0.2 : elapsed >= 12000 ? 0.3 : elapsed >= 8000 ? 0.7 : elapsed >= 4000 ? 1 : 1.5;
      arm.style.animationDuration = `${speed}s`;
    }
  };
  update();
  window.setInterval(update, 250);
})();
