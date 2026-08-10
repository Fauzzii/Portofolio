import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    id: 1,
    year: "2024 — Present",
    role: "Full-Stack Developer",
    company: "Tech Solutions / Freelance",
    desc: "Building scalable web apps, REST APIs, and micro-frontend modules — from zero to production.",
    techs: ["React", "Node.js", "PostgreSQL"],
    accent: "var(--accent-1)"
  },
  {
    id: 2,
    year: "2023 — 2024",
    role: "Front-End Engineer",
    company: "Digital Studio",
    desc: "Crafting pixel-perfect, interaction-rich UIs with React, GSAP, and modern CSS that delight users.",
    techs: ["GSAP", "Tailwind", "Figma"],
    accent: "var(--accent-2)"
  },
  {
    id: 3,
    year: "2022 — 2023",
    role: "UI/UX Designer",
    company: "Creative Agency",
    desc: "Designing user flows and high-fidelity Figma prototypes — then building them into real products myself.",
    techs: ["Figma", "UI/UX", "Prototyping"],
    accent: "var(--accent-3)"
  }
];

export default function Experience() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveals
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
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

      // Active scroll progress line drawing
      gsap.fromTo('.exp-line-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.exp-timeline',
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: true
          }
        }
      );

      // Scroll scrubbing for each experience item (dots and cards)
      const items = containerRef.current.querySelectorAll('.exp-item');
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const textSide = item.querySelector(isLeft ? '.exp-text-left' : '.exp-text-right');
        const card = item.querySelector('.exp-card');
        const dot = item.querySelector('.exp-dot');

        gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
          }
        })
        .fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(2)' })
        .fromTo(textSide,
          { opacity: 0, x: isLeft ? -40 : 40 },
          { opacity: 1, x: 0 },
          0
        )
        .fromTo(card,
          { opacity: 0, x: isLeft ? 40 : -40, scale: 0.95, rotationY: isLeft ? 8 : -8 },
          { opacity: 1, x: 0, scale: 1, rotationY: 0 },
          0
        );

        // Card mouse move 3D tilt effect
        const cardInner = item.querySelector('.exp-card-inner');
        if (cardInner) {
          const onMouseMove = (e) => {
            const rect = cardInner.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(cardInner, {
              rotationY: x * 0.05,
              rotationX: -y * 0.05,
              transformPerspective: 800,
              duration: 0.3,
              ease: 'power1.out'
            });
          };

          const onMouseLeave = () => {
            gsap.to(cardInner, {
              rotationY: 0,
              rotationX: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)'
            });
          };

          cardInner.addEventListener('mousemove', onMouseMove);
          cardInner.addEventListener('mouseleave', onMouseLeave);
        }
      });

      // Parallax deco assets
      const decos = containerRef.current.querySelectorAll('.plx-deco');
      decos.forEach(el => {
        const speed = parseFloat(el.dataset.speed || '0.2');
        gsap.to(el, {
          y: () => -(window.innerHeight * speed * 0.8),
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={containerRef} className="relative bg-[#f9f4eb] text-[#111] pt-36 pb-0 px-8 overflow-hidden bg-dot-grid-light">
      
      <div className="plx-deco select-none pointer-events-none absolute text-[4rem] opacity-[0.18]" data-speed="0.15" style={{ top: '6%', left: '3%', animation: 'floatA 6s ease-in-out infinite' }}>✦</div>
      <div className="plx-deco pointer-events-none absolute w-[90px] h-[90px] rounded-full border-3 border-black/5" data-speed="0.25" style={{ top: '20%', right: '5%', backgroundColor: 'var(--accent-2)', animation: 'floatB 8s ease-in-out infinite' }}></div>
      <div className="plx-deco select-none pointer-events-none absolute text-[3rem] opacity-[0.15]" data-speed="0.1" style={{ bottom: '12%', left: '7%', animation: 'floatA 9s ease-in-out infinite 1s' }}>◈</div>
      <div className="plx-deco pointer-events-none absolute w-[60px] h-[60px] rounded-[12px] rotate-[18deg] border-3 border-black/5" data-speed="0.2" style={{ top: '50%', right: '3%', backgroundColor: 'var(--accent-3)', animation: 'floatB 7s ease-in-out infinite 0.5s' }}></div>

      <div className="max-w-[1100px] mx-auto relative z-[1]">

        <div className="exp-header mb-28">
          <p className="exp-tag font-mono text-[0.7rem] tracking-[0.2em] uppercase text-black/40 mb-4 opacity-0">✦ Career Journey ✦</p>
          <h2 className="exp-title text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-[#111] opacity-0">
            Where I've<br /><span className="text-black/20 font-light italic">been.</span>
          </h2>
          <p className="exp-subtitle text-[1.05rem] text-black/50 mt-6 max-w-[420px] leading-relaxed opacity-0">A few stops along the way — each one taught me something new.</p>
        </div>

        <div className="exp-timeline relative flex flex-col gap-0">
          {/* Main background line track */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-black/5 -translate-x-1/2"></div>
          {/* Active progress scroll-drawn line */}
          <div className="exp-line-progress absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#111] -translate-x-1/2 origin-top scale-y-0"></div>

          {EXPERIENCES.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className="exp-item grid grid-cols-[1fr_100px_1fr] items-center mb-24 last:mb-0"
              >
                {isLeft ? (
                  <div className="exp-text-left pr-14 text-right opacity-0">
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-black/40">{exp.year}</span>
                    <h3 className="text-[1.2rem] sm:text-[1.5rem] md:text-[1.75rem] font-extrabold text-[#111] mt-2 tracking-tight">{exp.role}</h3>
                    <p className="text-black/45 text-[0.85rem] mt-1 font-mono">{exp.company}</p>
                  </div>
                ) : (
                  <div className="exp-card pr-14 opacity-0">
                    <div
                      style={{ borderLeft: `4px solid ${exp.accent}` }}
                      className="exp-card-inner bg-white/80 backdrop-blur-md border border-black/5 rounded-[16px] p-7 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
                    >
                      <p className="text-black/65 text-[0.85rem] sm:text-[0.95rem] leading-relaxed mb-4">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techs.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-black/5 text-black/60 border border-black/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center z-10">
                  <div
                    style={{ backgroundColor: exp.accent }}
                    className="exp-dot w-5 h-5 rounded-full border-4 border-[#f9f4eb] shadow-[0_0_0_2px_rgba(0,0,0,0.12)] opacity-0"
                  ></div>
                </div>

                {isLeft ? (
                  <div className="exp-card pl-14 opacity-0">
                    <div
                      style={{ borderLeft: `4px solid ${exp.accent}` }}
                      className="exp-card-inner bg-white/80 backdrop-blur-md border border-black/5 rounded-[16px] p-7 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)]"
                    >
                      <p className="text-black/65 text-[0.85rem] sm:text-[0.95rem] leading-relaxed mb-4">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techs.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-black/5 text-black/60 border border-black/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exp-text-right pl-14 text-left opacity-0">
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-black/40">{exp.year}</span>
                    <h3 className="text-[1.2rem] sm:text-[1.5rem] md:text-[1.75rem] font-extrabold text-[#111] mt-2 tracking-tight">{exp.role}</h3>
                    <p className="text-black/45 text-[0.85rem] mt-1 font-mono">{exp.company}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
