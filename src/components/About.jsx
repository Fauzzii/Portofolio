import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../assets/profile.jpeg';
import Lanyard from './Lanyard';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const [cardFrontUrl, setCardFrontUrl] = useState(null);
  const [cardBackUrl, setCardBackUrl] = useState(null);
  const [lanyardBgUrl, setLanyardBgUrl] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    // Create a beautiful custom strap texture matching the website theme (lavender, pink, yellow accents)
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#e5d9f6'); // lavender (var(--accent-1))
      grad.addColorStop(0.5, '#ffd2f3'); // pink (var(--accent-2))
      grad.addColorStop(1, '#fcdca6'); // yellow (var(--accent-3))
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 64);

      // Dark tech diagonal stripes
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 4;
      for (let x = -64; x < 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 64, 64);
        ctx.stroke();
      }

      // Border accents
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, 512, 5);
      ctx.fillRect(0, 59, 512, 5);

      setLanyardBgUrl(canvas.toDataURL());
    }
  }, []);

  useEffect(() => {
    // Generate back texture immediately (600x1100, aspect ratio 1:1.83) - Clean blank face
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 600;
    backCanvas.height = 1100;
    const backCtx = backCanvas.getContext('2d');
    if (backCtx) {
      const grad = backCtx.createLinearGradient(0, 0, 600, 1100);
      grad.addColorStop(0, '#0a0a0c');
      grad.addColorStop(1, '#15151b');
      backCtx.fillStyle = grad;
      backCtx.fillRect(0, 0, 600, 1100);

      // Border highlight
      backCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      backCtx.lineWidth = 8;
      backCtx.strokeRect(4, 4, 592, 1092);

      setCardBackUrl(backCanvas.toDataURL());
    }

    // Load profile photo to generate front texture
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = profileImg;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 600, 1100);
      grad.addColorStop(0, '#0c0c0e');
      grad.addColorStop(1, '#050507');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 1100);

      // Grid overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 600; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1100); ctx.stroke();
      }
      for (let y = 0; y < 1100; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y); ctx.stroke();
      }

      // Border highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 592, 1092);

      // Header text
      ctx.fillStyle = '#22d3ee'; // cyan-400
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('DEV PASS // 2026', 40, 75);

      // Green dot
      ctx.fillStyle = '#10b981'; // emerald-500
      ctx.beginPath();
      ctx.arc(540, 68, 8, 0, Math.PI * 2);
      ctx.fill();

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40, 105); ctx.lineTo(560, 105); ctx.stroke();

      // Draw profile picture fitted in container (ph = 540 for slightly shorter card)
      const px = 60, py = 145, pw = 480, ph = 540;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 4;
      ctx.strokeRect(px, py, pw, ph);

      // Fit image inside container preserving aspect ratio, compensating for 3D card stretch
      // New 3D stretch factor is (2.65 / 2.25) = 1.1778
      const stretchFactor = 2.65 / 2.25;
      const targetAspect = (img.width / img.height) * stretchFactor;
      let dw = pw, dh = ph;
      const containerAspect = pw / ph;
      if (targetAspect > containerAspect) {
        dw = pw;
        dh = pw / targetAspect;
      } else {
        dh = ph;
        dw = ph * targetAspect;
      }
      const dx = px + (pw - dw) / 2;
      const dy = py + (ph - dh) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      // Label: MEMBER NAME
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('MEMBER NAME', 40, 775);

      // Name: FAUZI EKA PUTRA
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('FAUZI EKA PUTRA', 40, 825);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40, 875); ctx.lineTo(560, 875); ctx.stroke();

      // Barcode on bottom left
      ctx.fillStyle = '#ffffff';
      const barcodeX = 40, barcodeY = 915, barcodeH = 70;
      const barcodeWeights = [3, 1, 5, 2, 4, 1, 3, 2, 5, 1, 3, 3, 2, 4];
      let currX = barcodeX;
      barcodeWeights.forEach((w) => {
        ctx.fillRect(currX, barcodeY, w * 3.5, barcodeH);
        currX += w * 3.5 + 5;
      });

      // Badge on bottom right: ACTIVE
      ctx.fillStyle = 'rgba(34, 211, 238, 0.06)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.lineWidth = 2;
      const badgeX = 410, badgeY = 930, badgeW = 150, badgeH = 45;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ACTIVE', badgeX + badgeW / 2, badgeY + badgeH / 2);

      setCardFrontUrl(canvas.toDataURL());
    };
  }, [profileImg]);

  const aboutText =
    'From crafting responsive front-end interfaces to developing robust back-end systems, ' +
    'I enjoy bringing complete digital solutions to life. I work with modern tools and ' +
    'frameworks to create applications that are fast, secure, and user-focused.';

  return (
    <section className="about animate-section" id="about" ref={sectionRef}>
      <div className="about-bg-grid" />

      {/* 3D Lanyard physics container - Desktop Only */}
      {isDesktop && (
        <div className="absolute inset-0 w-full h-full z-20 select-none">
          {cardFrontUrl && cardBackUrl && lanyardBgUrl && (
            <Lanyard
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              frontImage={cardFrontUrl}
              backImage={cardBackUrl}
              lanyardImage={lanyardBgUrl}
              imageFit="cover"
              lanyardWidth={1.4}
            />
          )}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-[1100px] w-full relative z-10 px-8 py-24 text-left mr-auto flex flex-col md:flex-row items-center gap-12">
        <div className="max-w-[720px] flex-1">
          <span className="about-mono-tag block text-white/35 font-mono text-[0.75rem] tracking-[0.25em] uppercase mb-6 select-none">
            ✦ ABOUT ME ✦
          </span>
          <h2 className="reveal-text text-xl sm:text-2xl md:text-4xl lg:text-[2.6rem] font-bold leading-normal tracking-tight text-white/20 select-none">
            {aboutText.split(' ').map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.25em]">{word}</span>
            ))}
          </h2>
        </div>

        {/* Flat CSS Dev Pass Badge - Mobile Only */}
        {!isDesktop && (
          <div className="flex-1 w-full flex justify-center mt-6 select-none animate-float-badge">
            <div className="w-[280px] h-[480px] bg-gradient-to-b from-[#0c0c0e] to-[#050507] border border-white/10 rounded-[20px] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
              
              {/* Card header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#22d3ee] tracking-wider">DEV PASS // 2026</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
              </div>

              {/* Profile image placeholder */}
              <div className="my-5 flex-1 relative border border-white/10 rounded-lg overflow-hidden bg-black/40">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover animate-none" />
              </div>

              {/* Bottom details */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="block font-mono text-[9px] text-white/40 tracking-wider">MEMBER NAME</span>
                  <span className="text-white text-lg font-bold">FAUZI EKA PUTRA</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  {/* Barcode lines */}
                  <div className="flex gap-1.5 items-end h-8">
                    <div className="w-1.5 h-full bg-white/70"></div>
                    <div className="w-0.5 h-4/5 bg-white/70"></div>
                    <div className="w-2 h-full bg-white/70"></div>
                    <div className="w-1 h-3/5 bg-white/70"></div>
                    <div className="w-1.5 h-4/5 bg-white/70"></div>
                  </div>
                  {/* Active badge */}
                  <span className="font-mono text-[10px] text-[#22d3ee] px-3.5 py-1.5 rounded-full bg-[#22d3ee]/5 border border-[#22d3ee]/15">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
