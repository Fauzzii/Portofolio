import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

const CONSOLE_LOGS = [
  'LOG: BOOTING_CORE_ENGINE',
  'LOG: LOADING_VECTORS_AND_FONTS',
  'LOG: TUNING_3D_MESH_COLLIDERS',
  'LOG: DRAFTING_PHYSICS_ANCHORS',
  'LOG: GENERATING_STRAP_TEXTURES',
  'LOG: CALIBRATING_DOT_FIELDMAP',
  'LOG: ESTABLISHING_SCROLL_TRIGGERS',
  'LOG: SYSTEM_READY_TO_LAUNCH'
];

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [logText, setLogText] = useState(CONSOLE_LOGS[0]);
  const containerRef = useRef(null);

  // SVG circle calculations: Radius = 85
  // Circumference = 2 * PI * 85 = 534.07
  const r = 85;
  const circ = 2 * Math.PI * r;
  const strokeDashoffset = circ - (count / 100) * circ;

  useEffect(() => {
    const obj = { val: 0 };

    // Fade-in entry contents
    gsap.fromTo(
      '.preloader-header, .preloader-body, .preloader-footer',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );

    // Animate counter from 0 to 100
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation: fade out elements first, then slide screen up
        gsap.timeline()
          .to('.preloader-ring-wrapper, .preloader-info', {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 1.8,
      ease: 'power1.inOut',
      onUpdate: () => {
        const rounded = Math.round(obj.val);
        setCount(rounded);
        const index = Math.min(Math.floor((rounded / 100) * CONSOLE_LOGS.length), CONSOLE_LOGS.length - 1);
        setLogText(CONSOLE_LOGS[index]);
      },
    });
  }, [onComplete]);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div ref={containerRef} className="preloader-container select-none">
      <div className="preloader-header">
        <span>FAUZI EKA PORTFOLIO</span>
        <span>SYS_INIT // V1.0.0</span>
      </div>

      <div className="preloader-body">
        <div className="preloader-ring-wrapper">
          <svg className="preloader-svg" viewBox="0 0 200 200">
            <circle
              className="preloader-circle-track"
              cx="100"
              cy="100"
              r={r}
            />
            <circle
              className="preloader-circle-bar"
              cx="100"
              cy="100"
              r={r}
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="preloader-counter-center">{formatNumber(count)}%</div>
        </div>

        <div className="preloader-info">
          <div className="preloader-title">LOADING PORTO</div>
          <div className="preloader-console-log">{logText}</div>
        </div>
      </div>

      <div className="preloader-footer">
        <span>DEVICE: WEB_CLIENT</span>
        <span>ALL SYSTEMS FUNCTIONAL</span>
      </div>
    </div>
  );
}
