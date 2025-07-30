gsap.registerPlugin(ScrollTrigger);

      const circles = Array.from(document.querySelectorAll(".circle"));

      const grouped = {};
      circles.forEach((circle) => {
        const order = Number(circle.dataset.order);
        if (!grouped[order]) grouped[order] = [];
        grouped[order].push(circle);
      });

      const orders = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-circles",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      orders.forEach((order, i) => {
        tl.fromTo(
          grouped[order],
          { y: "100%" },
          { y: "50%", ease: "power2.out" },
          i * 0.15
        );
      });