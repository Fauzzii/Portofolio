import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  { id: 1, val: 15, label: "Projects Completed", bg: "var(--accent-1)", icon: "✦" },
  { id: 2, val: 3, label: "Years of Experience", bg: "var(--accent-2)", icon: "◈" },
  { id: 3, val: 8, label: "Tech Stacks Mastered", bg: "var(--accent-3)", icon: "⬡" },
  { id: 4, val: 100, label: "Passion for What I Do", bg: "#f9f4eb", icon: "♥", isPercent: true }
];

function StatCard({ stat, index }) {
  const cardRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const numEl = numRef.current;
    if (!card || !numEl) return;

    const targetVal = stat.val;
    const isPct = stat.isPercent;
    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: card.closest('#stats'),
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        }
      })
      .fromTo(card,
        { opacity: 0, y: 60, scale: 0.85, rotation: index % 2 === 0 ? -4 : 4 },
        {
          opacity: 1, y: 0, scale: 1, rotation: 0,
          duration: 0.9, ease: 'back.out(1.7)', delay: index * 0.12
        }
      )
      .to(obj, {
        val: targetVal,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          const roundedVal = Math.round(obj.val);
          if (isPct) {
            numEl.innerHTML = `${roundedVal}<span style="font-size:.55em;vertical-align:super">%</span>`;
          } else {
            numEl.textContent = roundedVal;
          }
        }
      }, '-=0.3');

      const onMouseEnter = () => {
        gsap.to(card, {
          rotation: index % 2 === 0 ? -2 : 2,
          scale: 1.04,
          duration: 0.3,
          ease: 'power1.out'
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);

    }, cardRef);

    return () => ctx.revert();
  }, [stat, index]);

  return (
    <div
      ref={cardRef}
      style={{ backgroundColor: stat.bg }}
      className="stat-card border border-black/8 rounded-[20px] p-10 relative overflow-hidden opacity-0 cursor-default"
    >
      <div
        ref={numRef}
        style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)', lineHeight: 1 }}
        className="stat-num font-extrabold tracking-tight font-sans"
      >
        0
      </div>
      <div className="font-mono text-[0.75rem] uppercase tracking-widest text-black/55 mt-3">
        {stat.label}
      </div>
      <div className="absolute -bottom-5 -right-5 text-[5rem] opacity-5 pointer-events-none select-none">
        {stat.icon}
      </div>
    </div>
  );
}

export default function Stats() {
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current.closest('#stats'),
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="stats" className="relative bg-[#f9f4eb] text-black pt-12 pb-28 px-8 overflow-hidden">
      
      <div style={{ fontSize: 'clamp(8rem, 20vw, 18rem)' }} className="font-extrabold text-black/[0.035] whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none tracking-tighter font-sans">
        NUMBERS
      </div>

      <div className="stats-blob absolute -bottom-[40px] -left-[40px] w-[220px] h-[220px] rounded-full bg-[#ffd2f3] opacity-40 blur-[50px] pointer-events-none"></div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        <div ref={headerRef} className="stats-header text-center mb-20 opacity-0">
          <div className="inline-block font-mono text-[0.7rem] tracking-[0.2em] uppercase text-black/45 bg-black/5 border border-black/10 px-5 py-2 rounded-full mb-6">
            ✦ By The Numbers ✦
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }} className="font-bold tracking-tight leading-none">
            A lot has happened in<br />
            <span className="relative inline-block">
              a short time.
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd2f3] to-[#fcdca6] rounded-full"></span>
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-[900px] mx-auto stats-grid">
          {STATS_DATA.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
