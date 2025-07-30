document.addEventListener("DOMContentLoaded", () => {
  const cardSwap = document.querySelector(".card-swap");
  const cards = document.querySelectorAll(".gulir");
  const totalCards = cards.length;

  const config = {
    cardDistance: 60,
    verticalDistance: 70,
    delay: 5000,
    pauseOnHover: false,
    skewAmount: 6,
    easing: "elastic",
    width: 500,
    height: 400,
    animationConfig: {
      ease: "elastic.out(0.6,0.9)",
      durDrop: 2,
      durMove: 2,
      durReturn: 2,
      promoteOverlap: 0.9,
      returnDelay: 0.05,
    },
  };

  const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
  });

  const placeCard = (el, slot, skew) => {
    gsap.set(el, {
      x: slot.x,
      y: slot.y,
      z: slot.z,
      xPercent: -50,
      yPercent: -50,
      skewY: skew,
      transformOrigin: "center center",
      zIndex: slot.zIndex,
      force3D: true,
    });
  };

  cards.forEach((card, i) => {
    placeCard(
      card,
      makeSlot(i, config.cardDistance, config.verticalDistance, totalCards),
      config.skewAmount
    );
  });

  let order = Array.from({ length: totalCards }, (_, i) => i);
  let interval;

  const swap = () => {
    if (order.length < 2) return;

    const [front, ...rest] = order;
    const elFront = cards[front];
    const tl = gsap.timeline();

    tl.to(elFront, {
      y: "+=500",
      duration: config.animationConfig.durDrop,
      ease: config.animationConfig.ease,
    });

    tl.add(
      "promote",
      `-=${
        config.animationConfig.durDrop * config.animationConfig.promoteOverlap
      }`
    );

    rest.forEach((idx, i) => {
      const el = cards[idx];
      const slot = makeSlot(
        i,
        config.cardDistance,
        config.verticalDistance,
        totalCards
      );

      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.animationConfig.durMove,
          ease: config.animationConfig.ease,
        },
        `promote+=${i * 0.15}`
      );
    });

    const backSlot = makeSlot(
      totalCards - 1,
      config.cardDistance,
      config.verticalDistance,
      totalCards
    );
    tl.add(
      "return",
      `promote+=${
        config.animationConfig.durMove * config.animationConfig.returnDelay
      }`
    );
    tl.set(elFront, { zIndex: backSlot.zIndex }, "return");
    tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
    tl.to(
      elFront,
      {
        y: backSlot.y,
        duration: config.animationConfig.durReturn,
        ease: config.animationConfig.ease,
      },
      "return"
    );

    tl.call(() => {
      order = [...rest, front];
    });
  };

  swap();
  interval = setInterval(swap, config.delay);

  if (config.pauseOnHover) {
    cardSwap.addEventListener("mouseenter", () => {
      gsap.ticker.sleep();
      clearInterval(interval);
    });

    cardSwap.addEventListener("mouseleave", () => {
      gsap.ticker.wake();
      interval = setInterval(swap, config.delay);
    });
  }
});
