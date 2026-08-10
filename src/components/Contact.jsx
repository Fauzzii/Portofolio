import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [btnText, setBtnText] = useState('SEND IT');
  const [btnSent, setBtnSent] = useState(false);
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);

  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const formRef = useRef(null);
  const submitBtnRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      gsap.to(glow, {
        left: e.clientX - rect.left,
        top: e.clientY - rect.top,
        duration: 0.8,
        ease: 'power1.out'
      });
    };

    container.addEventListener('mousemove', onMouseMove);

    const ctx = gsap.context(() => {
      gsap.fromTo('.ctc-eyebrow',
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
      );
      gsap.fromTo('.ctc-heading',
        { opacity: 0, y: 80, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } }
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

      gsap.to(submitBtnRef.current, {
        boxShadow: '0 0 28px rgba(34,211,238,.2), 0 0 14px rgba(244,114,182,.1)',
        duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });

      gsap.fromTo('.ctc-footer',
        { opacity: 0 },
        { opacity: 1, duration: 1,
          scrollTrigger: { trigger: '.ctc-footer', start: 'top 95%', toggleActions: 'play none none reverse' } }
      );

      const socials = containerRef.current.querySelectorAll('.ctc-social');
      socials.forEach(link => {
        const onLinkEnter = () => gsap.to(link, { scale: 1.08, duration: 0.3, ease: 'back.out(1.5)' });
        const onLinkLeave = () => gsap.to(link, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,.4)' });
        const onLinkMove = (e) => {
          const r  = link.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
          const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
          gsap.to(link, { x: dx, y: dy, duration: 0.3, ease: 'power1.out' });
        };

        link.addEventListener('mouseenter', onLinkEnter);
        link.addEventListener('mouseleave', onLinkLeave);
        link.addEventListener('mousemove', onLinkMove);
      });

    }, containerRef);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      ctx.revert();
    };
  }, []);

  const triggerToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    const email = "fauziekaputra704@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      triggerToast('✦ Email copied to clipboard!');
    }).catch(() => {
      window.location.href = `mailto:${email}`;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const btn = submitBtnRef.current;
    if (!btn) return;

    gsap.timeline()
      .to(btn, { scale: 0.93, duration: 0.12, ease: 'power1.in' })
      .to(btn, { scale: 1.05, duration: 0.20, ease: 'back.out(2)' })
      .to(btn, { scale: 1,    duration: 0.40, ease: 'elastic.out(1,.4)' });

    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:fauziekaputra704@gmail.com?subject=${subject}&body=${body}`;

    setBtnSent(true);
    setBtnText('MESSAGE SENT!');
    triggerToast('✦ Opening email client...');

    setTimeout(() => {
      setBtnSent(false);
      setBtnText('SEND IT');
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" ref={containerRef} className="relative bg-[#050507] text-white py-32 px-8 min-h-screen flex items-center overflow-hidden bg-dot-grid-dark">
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>
      
      <div id="contact-glow" ref={glowRef} className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.07),transparent_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2 top-1/2 transition-all duration-300"></div>

      <div className="ctc-ring absolute top-[10%] -right-20 w-[400px] h-[400px] rounded-full border border-[#22d3ee]/[0.08] pointer-events-none" style={{ animation: 'ctcRotate 20s linear infinite' }}></div>
      <div className="ctc-ring absolute bottom-[5%] -left-[100px] w-[300px] h-[300px] rounded-full border border-[#f472b6]/[0.08] pointer-events-none" style={{ animation: 'ctcRotate 28s linear infinite reverse' }}></div>

      <div className="max-w-[1100px] mx-auto w-full relative z-[1]">

        <div className="ctc-eyebrow text-center mb-6 opacity-0">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-white/35">— say hello —</span>
        </div>

        <div className="ctc-heading text-center mb-20 opacity-0 overflow-hidden">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none m-0">
            Let's make<br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-[#22d3ee] via-[#f472b6] to-[#facc15] bg-clip-text text-transparent">something</span>
            </span><br />
            <span className="text-white/20 italic font-light mt-2 inline-block">cool together.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-16 items-start ctc-grid">

          <div className="ctc-left opacity-0">
            <p className="text-[1.15rem] text-white/55 leading-relaxed mb-10">
              Open to freelance gigs, full-time roles, and random creative collabs. If you've got an idea, I'm probably already excited about it.
            </p>

            <a
              href="mailto:fauziekaputra704@gmail.com"
              onClick={handleCopyEmail}
              id="ctc-email-btn"
              className="inline-flex items-center gap-3 font-mono text-[0.85rem] color-white border border-white/15 px-7 py-4 rounded-full text-decoration-none transition-all duration-350 mb-10 relative overflow-hidden group"
            >
              <i className="fas fa-envelope"></i>
              fauziekaputra704@gmail.com
              <span className="absolute inset-0 bg-gradient-to-r from-[#22d3ee]/12 to-[#f472b6]/12 opacity-0 transition-opacity duration-300 group-hover:opacity-100 btn-glow-overlay"></span>
            </a>

            <div className="flex gap-4 flex-wrap">
              <a href="https://github.com/Fauzzii" target="_blank" rel="noopener noreferrer" className="ctc-social flex items-center gap-2.5 font-mono text-[0.75rem] text-white/50 border border-white/[0.08] px-4 py-2.5 rounded-full transition-all duration-300">
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://www.linkedin.com/in/fauzi-eka-putra-086319286" target="_blank" rel="noopener noreferrer" className="ctc-social flex items-center gap-2.5 font-mono text-[0.75rem] text-white/50 border border-white/[0.08] px-4 py-2.5 rounded-full transition-all duration-300">
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
              <a href="https://www.instagram.com/fauzzii._/" target="_blank" rel="noopener noreferrer" className="ctc-social flex items-center gap-2.5 font-mono text-[0.75rem] text-white/50 border border-white/[0.08] px-4 py-2.5 rounded-full transition-all duration-300">
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>

          <div className="ctc-right opacity-0">
            <form id="contact-form" ref={formRef} onSubmit={handleFormSubmit} className="flex flex-col gap-5">

              <div className="ctc-field relative">
                <input
                  type="text"
                  id="ctc-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder=" "
                  required
                />
                <label htmlFor="ctc-name">Your Name</label>
              </div>

              <div className="ctc-field relative">
                <input
                  type="email"
                  id="ctc-email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder=" "
                  required
                />
                <label htmlFor="ctc-email">Email Address</label>
              </div>

              <div className="ctc-field relative">
                <textarea
                  id="ctc-msg"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder=" "
                  required
                ></textarea>
                <label htmlFor="ctc-msg">What's on your mind?</label>
              </div>

              <button
                type="submit"
                ref={submitBtnRef}
                className={`ctc-btn-custom ${btnSent ? 'sent' : ''}`}
              >
                <i className={btnSent ? "fas fa-check" : "fas fa-paper-plane"}></i>
                {btnText}
              </button>
            </form>
          </div>

        </div>

        <div className="ctc-footer border-t border-white/[0.07] mt-24 pt-8 flex justify-between items-center opacity-0">
          <p className="font-mono text-[0.7rem] text-white/25 tracking-wider">© 2026 FAUZI EKA PUTRA</p>
          <p className="font-mono text-[0.7rem] text-white/25 tracking-wider">CRAFTED WITH CODE & CAFFEINE ✦</p>
        </div>

      </div>

      <div className={`toast-notif ${showToast ? 'show' : ''}`}>
        {toastText}
      </div>
    </section>
  );
}
