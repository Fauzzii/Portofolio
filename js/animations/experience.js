function initExperienceAnimations() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#experience',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })
    .fromTo('.exp-tag',
      { opacity: 0, y: 25, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }
    )
    .fromTo('.exp-title',
      { opacity: 0, y: 60, skewY: 5 },
      { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'expo.out' }, '-=0.4'
    )
    .fromTo('.exp-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5'
    );

  gsap.fromTo('.exp-line',
    { scaleY: 0 },
    {
      scaleY: 1,
      duration: 1.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.exp-timeline',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  document.querySelectorAll('.exp-item').forEach((item, i) => {
    const textLeft = item.querySelector('.exp-text-left');
    const textRight = item.querySelector('.exp-text-right');
    const card = item.querySelector('.exp-card');
    const dot = item.querySelector('.exp-dot');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(dot,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.5)' }
    )
      .to(item, { opacity: 1, duration: 0.01 }, 0)
      .fromTo(textLeft || textRight,
        { opacity: 0, x: textLeft ? -60 : 60 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' }, '-=0.3'
      )
      .fromTo(card,
        { opacity: 0, x: textLeft ? 60 : -60, y: 20, rotationY: textLeft ? 15 : -15 },
        { opacity: 1, x: 0, y: 0, rotationY: 0, duration: 0.9, ease: 'back.out(1.5)' }, '-=0.75'
      );

    gsap.to(dot, {
      scale: 1.3,
      duration: 0.9 + i * 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.4
    });

    if (card) {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
          rotationY: x * 0.05,
          rotationX: -y * 0.05,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power1.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    }
  });

  document.querySelectorAll('.plx-deco').forEach(el => {
    const speed = parseFloat(el.dataset.speed || '0.2');
    gsap.to(el, {
      y: () => -(window.innerHeight * speed * 0.8),
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}
