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

      const items = containerRef.current.querySelectorAll('.exp-item');
      items.forEach((item, i) => {
        const textLeft = item.querySelector('.exp-text-left');
        const textRight = item.querySelector('.exp-text-right');
        const card = item.querySelector('.exp-card-inner');
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
          const onMouseMove = (e) => {
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
          };

          const onMouseLeave = () => {
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)'
            });
          };

          card.addEventListener('mousemove', onMouseMove);
          card.addEventListener('mouseleave', onMouseLeave);
        }
      });

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
    <section id="experience" ref={containerRef} className="relative bg-[#f9f4eb] text-[#111] pt-36 pb-0 px-8 overflow-hidden">
      
      <div className="plx-deco select-none pointer-events-none absolute text-[4rem] opacity-[0.18]" data-speed="0.15" style={{ top: '6%', left: '3%', animation: 'floatA 6s ease-in-out infinite' }}>✦</div>
      <div className="plx-deco pointer-events-none absolute w-[90px] h-[90px] rounded-full border-3 border-black/5" data-speed="0.25" style={{ top: '20%', right: '5%', backgroundColor: 'var(--accent-2)', animation: 'floatB 8s ease-in-out infinite' }}></div>
      <div className="plx-deco select-none pointer-events-none absolute text-[3rem] opacity-[0.15]" data-speed="0.1" style={{ bottom: '12%', left: '7%', animation: 'floatA 9s ease-in-out infinite 1s' }}>◈</div>
      <div className="plx-deco pointer-events-none absolute w-[60px] h-[60px] rounded-[12px] rotate-[18deg] border-3 border-black/5" data-speed="0.2" style={{ top: '50%', right: '3%', backgroundColor: 'var(--accent-3)', animation: 'floatB 7s ease-in-out infinite 0.5s' }}></div>

      <div className="max-w-[1100px] mx-auto relative z-[1]">

        <div className="exp-header mb-28">
          <p className="exp-tag font-mono text-[0.7rem] tracking-[0.2em] uppercase text-black/40 mb-4 opacity-0">✦ Career Journey ✦</p>
          <h2 className="exp-title text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-[#111] opacity-0">
            Where I've<br /><span className="text-black/20 font-light italic">been.</span>
          </h2>
          <p className="exp-subtitle text-[1.05rem] text-black/50 mt-6 max-w-[420px] leading-relaxed opacity-0">A few stops along the way — each one taught me something new.</p>
        </div>

        <div className="exp-timeline relative flex flex-col gap-0">
          <div className="exp-line absolute left-1/2 top-0 bottom-0 w-[1px] border-l-2 border-dashed border-black/15 -translate-x-1/2 origin-top"></div>

          {EXPERIENCES.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={exp.id}
                className="exp-item grid grid-cols-[1fr_100px_1fr] items-center mb-24 opacity-0 last:mb-0"
              >
                {isLeft ? (
                  <div className="exp-text-left pr-14 text-right">
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-black/40">{exp.year}</span>
                    <h3 className="text-[1.75rem] font-extrabold text-[#111] mt-2 tracking-tight">{exp.role}</h3>
                    <p className="text-black/45 text-[0.85rem] mt-1 font-mono">{exp.company}</p>
                  </div>
                ) : (
                  <div className="exp-card pr-14">
                    <div
                      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.06)' }}
                      className="exp-card-inner bg-white border-2 border-black/5 rounded-[16px] p-7 transition-all duration-300 hover:-translate-y-1"
                    >
                      <p className="text-black/65 text-[0.95rem] leading-relaxed mb-4">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techs.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{ backgroundColor: exp.accent }}
                            className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-black/5"
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
                    style={{ backgroundColor: exp.accent, boxShadow: '4px 4px 0 #111' }}
                    className="exp-dot w-6 h-6 rounded-full border-3 border-[#111]"
                  ></div>
                </div>

                {isLeft ? (
                  <div className="exp-card pl-14">
                    <div
                      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.06)' }}
                      className="exp-card-inner bg-white border-2 border-black/5 rounded-[16px] p-7 transition-all duration-300 hover:-translate-y-1"
                    >
                      <p className="text-black/65 text-[0.95rem] leading-relaxed mb-4">{exp.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techs.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{ backgroundColor: exp.accent }}
                            className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-black/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exp-text-right pl-14 text-left">
                    <span className="font-mono text-[0.65rem] tracking-wider uppercase text-black/40">{exp.year}</span>
                    <h3 className="text-[1.75rem] font-extrabold text-[#111] mt-2 tracking-tight">{exp.role}</h3>
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
