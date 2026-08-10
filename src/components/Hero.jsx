import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotField from './DotField';

gsap.registerPlugin(ScrollTrigger);

function Counter({ target }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targetVal = parseInt(target, 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: targetVal,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        once: true
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      }
    });
  }, [target]);

  return <span ref={ref} className="count font-mono" style={{ fontSize: '1rem' }}>0</span>;
}

export default function Hero({ isLoading }) {
  const containerRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (isLoading) return; // Wait for preloader to complete

    let heroSection;
    let onHeroMouseMove;
    let ctaListeners = [];

    const ctx = gsap.context(() => {
      const chars = nameRef.current.querySelectorAll('.char');
      gsap.set(nameRef.current, { visibility: 'visible' });

      gsap.fromTo(chars,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          stagger: { from: "center", amount: 0.5 },
          onComplete: () => {
            gsap.to(chars, {
              yPercent: -100,
              stagger: { from: "center", amount: 0.5 },
              scrollTrigger: {
                trigger: nameRef.current,
                start: "top top",
                end: () => `+=${nameRef.current.offsetHeight * 0.5}`,
                scrub: true,
              },
            });
          }
        }
      );

      const smoothStep = (p) => p * p * (3 - 2 * p);

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "75% top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          gsap.set(".hero-cards", {
            opacity: gsap.utils.interpolate(1, 0.5, smoothStep(progress)),
            force3D: true,
          });

          ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach((cardId, index) => {
            const delay = index * 0.9;
            const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1));

            const y = gsap.utils.interpolate("0%", "250%", smoothStep(cardProgress));
            const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress));

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
          });
        },
      });

      const ctas = containerRef.current.querySelectorAll('.btn-primary, .btn-secondary');
      ctas.forEach(btn => {
        const onBtnEnter = () => gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'back.out(1.5)' });
        const onBtnLeave = () => gsap.to(btn, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' });
        const onBtnMove = (e) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width / 2) * 0.35;
          const dy = (e.clientY - r.top - r.height / 2) * 0.35;
          gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power1.out' });
        };

        btn.addEventListener('mouseenter', onBtnEnter);
        btn.addEventListener('mouseleave', onBtnLeave);
        btn.addEventListener('mousemove', onBtnMove);

        ctaListeners.push({
          btn,
          enter: onBtnEnter,
          leave: onBtnLeave,
          move: onBtnMove
        });
      });

      const badgeWrappers = containerRef.current.querySelectorAll('.floating-badge-wrapper');
      onHeroMouseMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        badgeWrappers.forEach((wrapper, idx) => {
          const factor = (idx + 1) * 18;
          gsap.to(wrapper, {
            x: dx * factor,
            y: dy * factor,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      };

      heroSection = containerRef.current;
      heroSection.addEventListener('mousemove', onHeroMouseMove);

    }, containerRef);

    return () => {
      ctx.revert();
      if (heroSection && onHeroMouseMove) {
        heroSection.removeEventListener('mousemove', onHeroMouseMove);
      }
      ctaListeners.forEach(({ btn, enter, leave, move }) => {
        btn.removeEventListener('mouseenter', enter);
        btn.removeEventListener('mouseleave', leave);
        btn.removeEventListener('mousemove', move);
      });
    };
  }, [isLoading]);

  const nameWords = "Fauzi Eka Putra".split(" ");

  const handleCtaClick = (e, href) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="hero" id="hero" ref={containerRef}>
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="floating-badge-wrapper fb-1">
        <div className="floating-badge">⚡ React.js</div>
      </div>
      <div className="floating-badge-wrapper fb-2">
        <div className="floating-badge">✦ Node.js</div>
      </div>
      <div className="floating-badge-wrapper fb-3">
        <div className="floating-badge">◈ GSAP</div>
      </div>
      <div className="floating-badge-wrapper fb-4">
        <div className="floating-badge">⬡ Tailwind</div>
      </div>

      <div className="name select-none" ref={nameRef} style={{ visibility: 'hidden' }}>
        {nameWords.map((word, wIdx) => (
          <span key={wIdx} className="word inline-flex mr-[0.2em] overflow-hidden">
            {word.split("").map((char, cIdx) => (
              <span key={cIdx} className="char inline-block">
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* Animated DotField Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <DotField
          dotRadius={1.8}
          dotSpacing={14}
          cursorRadius={450}
          cursorForce={0.12}
          bulgeOnly={true}
          bulgeStrength={85}
          glowRadius={220}
          sparkle={true}
          waveAmplitude={2}
          gradientFrom="rgba(124, 58, 237, 0.45)"
          gradientTo="rgba(236, 72, 153, 0.35)"
          glowColor="rgba(229, 217, 246, 0.25)"
        />
      </div>

      <p className="hero-tagline">
        Full-Stack Developer specializing in web application building, UI/UX design, and machine learning solutions.
      </p>

      <div className="hero-cta-group">
        <a href="#projects" onClick={(e) => handleCtaClick(e, '#projects')} className="btn-primary">Explore Work ✦</a>
        <a href="#contact" onClick={(e) => handleCtaClick(e, '#contact')} className="btn-secondary">Get In Touch</a>
      </div>

      <div className="shape">
        <div>✦ ✦ ✦</div>
        <Counter target="2025" />
        <div>
          <a href="https://www.linkedin.com/in/fauzi-eka-putra-086319286" target="_blank" rel="noopener noreferrer" style={{ color: '#000' }} aria-label="LinkedIn Profile">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <div>
          <a href="https://github.com/Fauzzii" target="_blank" rel="noopener noreferrer" style={{ color: '#000' }} aria-label="GitHub Profile">
            <i className="fab fa-github"></i>
          </a>
        </div>
        <div>
          <a href="https://www.instagram.com/fauzzii._/" target="_blank" rel="noopener noreferrer" style={{ color: '#000' }} aria-label="Instagram Profile">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <Counter target="1905" />
        <div>✦ ✦ ✦</div>
      </div>

      <div className="hero-cards">
        <div className="card" id="hero-card-1">
          <div className="card-title">
            <span>Programming</span>
            <span>01</span>
          </div>
          <div className="card-title">
            <span>01</span>
            <span>Programming</span>
          </div>
        </div>
        <div className="card" id="hero-card-2">
          <div className="card-title">
            <span>Design</span>
            <span>02</span>
          </div>
          <div className="card-title">
            <span>02</span>
            <span>Design</span>
          </div>
        </div>
        <div className="card" id="hero-card-3">
          <div className="card-title">
            <span>Others</span>
            <span>03</span>
          </div>
          <div className="card-title">
            <span>03</span>
            <span>Others</span>
          </div>
        </div>
      </div>
    </section>
  );
}
