gsap.registerPlugin(ScrollTrigger);
      const text = new SplitType(".name", { types: "words, chars" });

      gsap.set(".name", { autoAlpha: 1 });
      gsap.set(text.chars, { yPercent: 100 });

      const initialAnimation = gsap.to(text.chars, {
        yPercent: 0,
        duration: 1,
        ease: "power2.out",
        stagger: { from: "center", amount: 0.5 },
        onComplete: activateScrollTrigger,
      });

      function activateScrollTrigger() {
        gsap.to(text.chars, {
          yPercent: -100,
          stagger: { from: "center", amount: 0.5 },
          scrollTrigger: {
            trigger: ".name",
            start: "top top",
            end: () =>
              `+=${document.querySelector(".name").offsetHeight * 0.5}`,
            scrub: 1,
          },
        });
      }