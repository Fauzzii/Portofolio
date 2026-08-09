document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ─── Lenis: Tuned exponential easing for 60-120fps ultra-smooth scrolling ──
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    wheelMultiplier: 1.1,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const smoothStep = (p) => p * p * (3 - 2 * p);

  // ─── Hero cards disperse animation (scrub: true = 1:1 instant mapping) ───
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "75% top",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      gsap.set(".hero-cards", {
        opacity: gsap.utils.interpolate(1, 0.5, smoothStep(progress)),
        force3D: true,
      });

      ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
        (cardId, index) => {
          const delay = index * 0.9;
          const cardProgress = gsap.utils.clamp(
            0,
            1,
            (progress - delay * 0.1) / (1 - delay * 0.1)
          );

          const y = gsap.utils.interpolate(
            "0%",
            "250%",
            smoothStep(cardProgress)
          );
          const scale = gsap.utils.interpolate(
            1,
            0.75,
            smoothStep(cardProgress)
          );

          let x = "0%";
          let rotation = 0;
          if (index === 0) {
            x = gsap.utils.interpolate("0%", "90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress));
          } else if (index === 2) {
            x = gsap.utils.interpolate("0%", "-90%", smoothStep(cardProgress));
            rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress));
          }

          gsap.set(cardId, {
            y: y,
            x: x,
            rotation: rotation,
            scale: scale,
            force3D: true,
          });
        }
      );
    },
  });

  // ─── Services Pin ─────────────────────────────────────────────────────────
  ScrollTrigger.create({
    trigger: ".services",
    start: "top top",
    end: `+=${window.innerHeight * 4}px`,
    pin: ".services",
    pinSpacing: true,
  });

  ScrollTrigger.create({
    trigger: ".services",
    start: "top top",
    end: `+=${window.innerHeight * 4}px`,
    onLeave: () => {
      const servicesSection = document.querySelector(".services");
      const servicesRect = servicesSection.getBoundingClientRect();
      const servicesTop = window.pageYOffset + servicesRect.top;
      gsap.set(".cards", {
        position: "absolute",
        top: servicesTop,
        left: 0,
        width: "100vw",
        height: "100vh",
        force3D: true,
      });
    },
    onEnterBack: () => {
      gsap.set(".cards", {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        force3D: true,
      });
    },
  });

  // ─── Services Flip Card Animation (scrub: true = 1:1 instant response) ──
  const updateCards = (progress) => {
    const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);

    gsap.set(".services-header", {
      y: gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress)),
      force3D: true,
    });

    ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
      const isMobile = window.innerWidth <= 768;
      const delay = isMobile ? 0 : index * 0.5;
      const cardProgress = gsap.utils.clamp(
        0,
        1,
        (progress - delay * 0.1) / (0.9 - delay * 0.1)
      );

      const innerCard = document.querySelector(`${cardId} .flip-card-inner`);

      const entryProgress = isMobile
        ? gsap.utils.clamp(0, 1, progress / 0.9)
        : cardProgress;

      let baseY;
      if (entryProgress < 0.4) {
        baseY = gsap.utils.interpolate(
          -250,
          50,
          smoothStep(entryProgress / 0.4)
        );
      } else if (entryProgress < 0.6) {
        baseY = gsap.utils.interpolate(
          50,
          0,
          smoothStep((entryProgress - 0.4) / 0.2)
        );
      } else {
        baseY = 0;
      }

      let mult =
        cardProgress < 0.6
          ? 1
          : cardProgress < 1
          ? 1 - smoothStep((cardProgress - 0.6) / 0.4)
          : 0;

      let y;
      if (isMobile) {
        if (index === 0) {
          y = `calc(${baseY}% + ${mult * 100}% + ${mult * 1.2}rem)`;
        } else if (index === 1) {
          y = `${baseY}%`;
        } else {
          y = `calc(${baseY}% - ${mult * 100}% - ${mult * 1.2}rem)`;
        }
      } else {
        y = baseY + "%";
      }

      const scale =
        entryProgress < 0.4
          ? gsap.utils.interpolate(0.25, 0.75, smoothStep(entryProgress / 0.4))
          : entryProgress < 0.6
          ? gsap.utils.interpolate(0.75, 1, smoothStep((entryProgress - 0.4) / 0.2))
          : 1;

      const opacity =
        entryProgress < 0.2
          ? smoothStep(entryProgress / 0.2)
          : 1;

      let x, rotate, rotationY;
      if (isMobile) {
        x = "0%";
        if (cardProgress < 0.6) {
          rotate = 0;
          rotationY = 0;
        } else if (cardProgress < 1) {
          const normalizedProgress = (cardProgress - 0.6) / 0.4;
          rotate = 0;
          rotationY = smoothStep(normalizedProgress) * 180;
        } else {
          rotate = 0;
          rotationY = 180;
        }
      } else {
        if (cardProgress < 0.6) {
          x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
          rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
          rotationY = 0;
        } else if (cardProgress < 1) {
          const normalizedProgress = (cardProgress - 0.6) / 0.4;
          x = gsap.utils.interpolate(
            index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
            "0%",
            smoothStep(normalizedProgress)
          );
          rotate = gsap.utils.interpolate(
            index === 0 ? -5 : index === 1 ? 0 : 5,
            0,
            smoothStep(normalizedProgress)
          );
          rotationY = smoothStep(normalizedProgress) * 180;
        } else {
          x = "0%";
          rotate = 0;
          rotationY = 180;
        }
      }

      gsap.set(cardId, {
        opacity: opacity,
        y: y,
        x: x,
        rotate: rotate,
        scale: scale,
        force3D: true,
      });

      gsap.set(innerCard, {
        rotationY: rotationY,
        force3D: true,
      });
    });
  };

  ScrollTrigger.create({
    trigger: ".services",
    start: "top bottom",
    end: `+=${window.innerHeight * 4}px`,
    scrub: true,
    onUpdate: (self) => {
      updateCards(self.progress);
    },
  });

  updateCards(0);
});