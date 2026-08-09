function initStatsAnimations() {
  gsap.fromTo('.stats-header',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: {
        trigger: '#stats', start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  document.querySelectorAll('.stat-card').forEach((card, i) => {
    const numEl     = card.querySelector('.stat-num');
    const targetVal = parseInt(card.dataset.val, 10);
    const hasPct    = targetVal === 100;

    gsap.timeline({
      scrollTrigger: {
        trigger: '#stats', start: 'top 65%',
        toggleActions: 'play none none reverse'
      }
    })
    .fromTo(card,
      { opacity: 0, y: 60, scale: 0.85, rotation: i % 2 === 0 ? -4 : 4 },
      { opacity: 1, y: 0, scale: 1, rotation: 0,
        duration: 0.9, ease: 'back.out(1.7)', delay: i * 0.12 }
    )
    .to({ val: 0 }, {
      val: targetVal, duration: 1.8, ease: 'power2.out',
      onUpdate() {
        const v = Math.round(this.targets()[0].val);
        numEl.innerHTML = hasPct
          ? `${v}<span style="font-size:.55em;vertical-align:super">%</span>`
          : v;
      }
    }, '-=0.3');

    card.addEventListener('mouseenter', () =>
      gsap.to(card, { rotation: i % 2 === 0 ? -2 : 2, scale: 1.04, duration: 0.3, ease: 'power1.out' }));
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,.4)' }));
  });
}

function initSudokuSectionAnimation() {
  gsap.fromTo('.sdk-header',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: {
        trigger: '#sudoku', start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
  gsap.fromTo(['.sdk-controls', '.sdk-game'],
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: {
        trigger: '#sudoku', start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

function initContactAnimations() {
  const contactSection = document.getElementById('contact');
  const contactGlow    = document.getElementById('contact-glow');
  if (contactSection && contactGlow) {
    contactSection.addEventListener('mousemove', e => {
      const rect = contactSection.getBoundingClientRect();
      gsap.to(contactGlow, {
        left: e.clientX - rect.left,
        top : e.clientY - rect.top,
        duration: 0.8, ease: 'power1.out'
      });
    });
  }

  gsap.fromTo('.ctc-eyebrow',
    { opacity: 0, y: -15 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' } }
  );
  gsap.fromTo('.ctc-heading',
    { opacity: 0, y: 80, skewY: 4 },
    { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: '#contact', start: 'top 75%', toggleActions: 'play none none reverse' } }
  );

  gsap.fromTo('.ctc-left',
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ctc-grid', start: 'top 80%', toggleActions: 'play none none reverse' } }
  );
  gsap.fromTo('.ctc-right',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ctc-grid', start: 'top 80%', toggleActions: 'play none none reverse' } }
  );

  gsap.fromTo('.ctc-field',
    { opacity: 0, y: 25, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.ctc-right', start: 'top 80%', toggleActions: 'play none none reverse' } }
  );

  gsap.to('#ctc-submit-btn', {
    boxShadow: '0 0 28px rgba(34,211,238,.2), 0 0 14px rgba(244,114,182,.1)',
    duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  gsap.fromTo('.ctc-footer',
    { opacity: 0 },
    { opacity: 1, duration: 1,
      scrollTrigger: { trigger: '.ctc-footer', start: 'top 95%', toggleActions: 'play none none reverse' } }
  );

  document.querySelectorAll('.ctc-social').forEach(link => {
    link.addEventListener('mouseenter', () =>
      gsap.to(link, { scale: 1.08, duration: 0.3, ease: 'back.out(1.5)' }));
    link.addEventListener('mouseleave', () =>
      gsap.to(link, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' }));
    link.addEventListener('mousemove', e => {
      const r  = link.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      gsap.to(link, { x: dx, y: dy, duration: 0.3, ease: 'power1.out' });
    });
  });
}

function copyEmailToClipboard(email, e) {
  if (e) e.preventDefault();
  navigator.clipboard.writeText(email).then(() => {
    showToast('✦ Email copied to clipboard!');
  }).catch(() => {
    window.location.href = `mailto:${email}`;
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notif';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('ctc-submit-btn');
  if (!btn) return;

  gsap.timeline()
    .to(btn, { scale: 0.93, duration: 0.12, ease: 'power1.in' })
    .to(btn, { scale: 1.05, duration: 0.20, ease: 'back.out(2)' })
    .to(btn, { scale: 1,    duration: 0.40, ease: 'elastic.out(1,.4)' });

  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = '#22d3ee';

  showToast('✦ Thank you! Your message has been sent.');

  setTimeout(() => {
    btn.innerHTML    = '<i class="fas fa-paper-plane"></i> SEND IT';
    btn.style.background = 'linear-gradient(135deg,#22d3ee,#f472b6)';
    document.getElementById('contact-form')?.reset();
  }, 3000);
}
