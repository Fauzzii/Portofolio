import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../assets/profile.png';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const cardRef    = useRef(null);
  const wrapperRef = useRef(null);
  const isDragging = useRef(false);
  const mouseRef   = useRef({ x: 0, y: 0 });
  const anchorsRef = useRef({ left: { x: 0, y: 10 }, right: { x: 0, y: 10 } });
  const cardRotRef = useRef(0);

  useEffect(() => {
    // ── Scroll word-reveal ────────────────────────────────────────────────────
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.reveal-word'),
        { color: 'rgba(255,255,255,0.18)' },
        {
          color: '#ffffff', stagger: 0.03, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%', end: 'bottom 60%', scrub: true,
          },
        }
      );
    }, sectionRef);

    // ── Physics constants ─────────────────────────────────────────────────────
    const N       = 12;     // rope segments
    const SEG     = 24;     // px per segment
    const STRAP   = 140;    // V-neck strap max length (px)
    const SPREAD  = 85;     // shoulder anchor half-width (px)
    const G       = 0.28;   // gravity per sub-step
    const DAMP    = 0.988;  // natural damping: card gradually settles to rest when released
    const BNC     = 0.58;   // boundary restitution (how bouncy walls are)
    const SUB     = 3;      // sub-steps per frame for accuracy
    const I_REST  = 18;     // constraint solver iterations at rest
    const I_DRAG  = 7;      // constraint iterations while dragging

    // ── Canvas setup ──────────────────────────────────────────────────────────
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');

    const fitCanvas = () => {
      const r = sectionRef.current.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
    };
    fitCanvas();

    const AY = 10;
    const getAx = () => (canvas.width > 768 ? canvas.width * 0.72 : canvas.width * 0.80);
    const setAnchors = () => {
      const ax = getAx();
      anchorsRef.current = {
        left:  { x: ax - SPREAD, y: AY },
        right: { x: ax + SPREAD, y: AY },
      };
    };
    setAnchors();

    const handleResize = () => { fitCanvas(); setAnchors(); };
    window.addEventListener('resize', handleResize);

    // ── Rope initialisation ───────────────────────────────────────────────────
    // Rope hangs straight down at rest
    const pts = [];
    const ax = getAx();
    for (let i = 0; i < N; i++) {
      const d  = STRAP + i * SEG;
      const px = ax;
      const py = AY + d;
      pts.push({ x: px, y: py, oldX: px, oldY: py });
    }

    // ── Cubic cardinal spline ─────────────────────────────────────────────────
    const spline = (pts) => {
      if (pts.length < 2) return;
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(i + 2, pts.length - 1)];
        const T  = 0.5;
        c.bezierCurveTo(
          p1.x + (p2.x - p0.x) * T / 3,
          p1.y + (p2.y - p0.y) * T / 3,
          p2.x - (p3.x - p1.x) * T / 3,
          p2.y - (p3.y - p1.y) * T / 3,
          p2.x, p2.y,
        );
      }
    };

    const drawRope = (pArr, width, color) => {
      c.beginPath(); spline(pArr);
      c.lineWidth = width; c.strokeStyle = color;
      c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    };

    // ── Physics step (runs SUB times per frame) ───────────────────────────────
    const CARD_H = 310, CARD_W = 190;

    const step = () => {
      // Continuous slow, subtle sway (oscillates left & right gently without stopping)
      const time = Date.now() * 0.0012;
      const swayForce = Math.sin(time) * 0.025;

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const vx = (p.x - p.oldX) * DAMP;
        const vy = (p.y - p.oldY) * DAMP;
        p.oldX = p.x; p.oldY = p.y;
        p.x += vx;
        p.y += vy + G;

        if (!isDragging.current && i > 0) {
          p.x += swayForce * (i / N);
        }
      }

      // Mouse drag — pull card tip toward cursor with heavy smooth inertia
      if (isDragging.current) {
        const tip = pts[N - 1];
        tip.x += (mouseRef.current.x - tip.x) * 0.06;
        tip.y += (mouseRef.current.y - tip.y) * 0.06;
      }

      // Constraint solver
      const iters = isDragging.current ? I_DRAG : I_REST;
      const { left, right } = anchorsRef.current;
      for (let k = 0; k < iters; k++) {
        // Confine clip point within strap radius of both shoulder anchors
        const p0 = pts[0];
        for (const anch of [left, right]) {
          const dx = p0.x - anch.x;
          const dy = p0.y - anch.y;
          const d  = Math.hypot(dx, dy);
          if (d > STRAP) {
            const s = STRAP / d;
            p0.x = anch.x + dx * s;
            p0.y = anch.y + dy * s;
          }
        }

        // Maintain segment lengths along rope
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d  = Math.hypot(dx, dy);
          if (d < 0.001) continue;
          const f = (SEG - d) / d * 0.5;
          a.x -= dx * f; a.y -= dy * f;
          // Last segment: keep fixed while dragging so card sticks to cursor
          if (i < N - 2 || !isDragging.current) {
            b.x += dx * f; b.y += dy * f;
          }
        }
      }

      // Boundary collisions — properly reflect velocity, don't kill it
      const tip = pts[N - 1];
      if (tip.y > canvas.height - CARD_H - 10) {
        const vy = tip.y - tip.oldY;
        tip.y    = canvas.height - CARD_H - 10;
        tip.oldY = tip.y + Math.abs(vy) * BNC; // reflect upward
      }
      if (tip.y < AY + 22) {
        const vy = tip.y - tip.oldY;
        tip.y    = AY + 22;
        tip.oldY = tip.y - Math.abs(vy) * BNC; // reflect downward
      }
      if (tip.x < CARD_W / 2 + 10) {
        const vx = tip.x - tip.oldX;
        tip.x    = CARD_W / 2 + 10;
        tip.oldX = tip.x + Math.abs(vx) * BNC; // reflect right
      }
      if (tip.x > canvas.width - CARD_W / 2 - 10) {
        const vx = tip.x - tip.oldX;
        tip.x    = canvas.width - CARD_W / 2 - 10;
        tip.oldX = tip.x - Math.abs(vx) * BNC; // reflect left
      }


    };

    // ── Render loop ───────────────────────────────────────────────────────────
    let raf;
    const render = () => {
      for (let s = 0; s < SUB; s++) step();

      c.clearRect(0, 0, canvas.width, canvas.height);

      const { left, right } = anchorsRef.current;
      const clip = pts[0];
      const tip  = pts[N - 1];

      // Shoulder anchor dots
      c.fillStyle = '#252528';
      c.beginPath();
      c.arc(left.x,  left.y,  6, 0, Math.PI * 2);
      c.arc(right.x, right.y, 6, 0, Math.PI * 2);
      c.fill();

      // V-neck straps: left shoulder → clip, right shoulder → clip
      drawRope([left,  clip], 13, '#18181b'); drawRope([left,  clip], 2.5, '#22d3ee');
      drawRope([right, clip], 13, '#18181b'); drawRope([right, clip], 2.5, '#22d3ee');

      // Drop rope: clip → card hook
      const drop = [clip, ...pts.slice(1)];
      drawRope(drop, 13, '#18181b');
      drawRope(drop, 2.5, '#22d3ee');

      // Clip bead at junction point
      c.fillStyle = '#3a3a3e';
      c.beginPath(); c.arc(clip.x, clip.y, 7, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#5a5a60';
      c.beginPath(); c.arc(clip.x - 1.5, clip.y - 2, 2.5, 0, Math.PI * 2); c.fill();

      // Metal hook tab at top of card
      c.fillStyle = '#4a4a50';
      c.beginPath();
      c.roundRect(tip.x - 4.5, tip.y - 14, 9, 14, 2);
      c.fill();

      // Lerp card rotation for buttery-smooth angle updates
      const prev = pts[N - 2];
      const targetDeg = Math.atan2(tip.y - prev.y, tip.x - prev.x) * (180 / Math.PI) - 90;
      cardRotRef.current += (targetDeg - cardRotRef.current) * 0.10;

      if (cardRef.current) {
        cardRef.current.style.transform = [
          `translate3d(${tip.x}px,${tip.y}px,0)`,
          `translate(-50%,0)`,
          `rotateZ(${cardRotRef.current}deg)`,
        ].join(' ');
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateMouse = (e) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (r) mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const aboutText =
    'From crafting responsive front-end interfaces to developing robust back-end systems, ' +
    'I enjoy bringing complete digital solutions to life. I work with modern tools and ' +
    'frameworks to create applications that are fast, secure, and user-focused.';

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-bg-grid" />

      {/* Full-section physics overlay */}
      <div
        ref={wrapperRef}
        onMouseDown={(e) => { isDragging.current = true; updateMouse(e); }}
        onMouseMove={updateMouse}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; }}
        className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        {/* Developer ID Card */}
        <div
          ref={cardRef}
          className="lanyard-card absolute top-0 left-0 w-[190px] aspect-[5/8] rounded-[14px] border border-white/10 overflow-hidden shadow-[0_28px_65px_rgba(0,0,0,0.72)] bg-[#0c0c0e]/95 p-3.5 flex flex-col justify-between pointer-events-none origin-[50%_0%] z-30"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="font-mono text-[8px] tracking-wider text-cyan-400 font-bold">DEV PASS // 2026</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="w-full aspect-square rounded-[8px] overflow-hidden border border-white/10 bg-black/40 mt-2.5">
            <img
              src={profileImg}
              alt="Fauzi Eka Putra"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          <div className="text-left mt-3">
            <div className="font-mono text-[8px] uppercase tracking-widest text-white/40 font-semibold">MEMBER NAME</div>
            <div className="font-sans font-extrabold text-[12px] text-white mt-0.5 tracking-tight">FAUZI EKA PUTRA</div>
          </div>

          <div className="flex justify-between items-end border-t border-white/5 pt-2.5 mt-2.5">
            <div className="h-4 w-12 bg-white/90 flex items-center justify-between px-0.5 rounded-[1px] opacity-80">
              {[2, 1, 3, 1, 2].map((w, i) => (
                <div key={i} className="h-full bg-black" style={{ width: w * 2 }} />
              ))}
            </div>
            <div className="font-mono text-[7px] bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2 py-0.5 rounded-full font-bold">
              ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="max-w-[1100px] w-full relative z-10 px-8 py-24 text-left mr-auto">
        <div className="max-w-[720px]">
          <span className="about-mono-tag block text-white/35 font-mono text-[0.75rem] tracking-[0.25em] uppercase mb-6 select-none">
            ✦ ABOUT ME ✦
          </span>
          <h2 className="reveal-text text-2xl md:text-4xl lg:text-[2.6rem] font-bold leading-normal tracking-tight text-white/20 select-none">
            {aboutText.split(' ').map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.25em]">{word}</span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
