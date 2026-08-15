window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.add('loaded'), 2500);
});

document.getElementById('year').textContent = new Date().getFullYear();
