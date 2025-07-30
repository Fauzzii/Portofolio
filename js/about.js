gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".reveal-left").forEach((el) => {
  gsap.fromTo(
    el,
    { x: -100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    }
  );
});

gsap.utils.toArray(".reveal-right").forEach((el) => {
  gsap.fromTo(
    el,
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    }
  );
});
