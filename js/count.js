window.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");

  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    const duration = 1500;
    const frameRate = 60;
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;

    const count = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * progress);
      counter.textContent = current;

      if (frame >= totalFrames) {
        clearInterval(count);
        counter.textContent = target;
      }
    }, 1000 / frameRate);
  });
});
