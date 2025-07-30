window.addEventListener("DOMContentLoaded", () => {
    gsap.from("nav", {
      y: -200, // geser dari atas
      duration: 2.5,
      ease: "power2.out"
    });
  });