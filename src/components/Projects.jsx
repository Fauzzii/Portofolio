import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "01 / Web Dev",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    desc: "A full-featured digital shop equipped with Stripe payment gateway, real-time inventory management, responsive cart experience, and a high-performance admin dashboard built for enterprise workloads.",
    techs: ["React", "Node.js", "MongoDB", "Stripe"]
  },
  {
    id: 2,
    title: "Task Management App",
    category: "02 / Mobile App",
    img: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&q=80",
    desc: "Collaborative project tracking application featuring real-time WebSockets synchronization, drag-and-drop Kanban boards, sprint planning modules, and automated team notifications.",
    techs: ["Vue.js", "Socket.io", "PostgreSQL"]
  },
  {
    id: 3,
    title: "Weather Dashboard",
    category: "03 / Data Viz",
    img: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=900&q=80",
    desc: "Live meteorology interface tracking global weather patterns, 7-day radar forecasts, atmospheric data graphs using Chart.js, and offline PWA capability.",
    techs: ["JavaScript", "Chart.js", "PWA"]
  },
  {
    id: 4,
    title: "Blog & CMS Platform",
    category: "04 / CMS",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
    desc: "Modern headless content management platform with rich markdown editor, Sanity.io backend integration, automated SEO meta tags, and role-based permissions.",
    techs: ["Next.js", "Sanity.io", "TypeScript"]
  },
  {
    id: 5,
    title: "Social Media Analytics",
    category: "05 / Analytics",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80",
    desc: "Unified analytics dashboard tracking audience engagement metrics, post reach, and follower conversion trends across multiple social APIs in real-time.",
    techs: ["React", "D3.js", "GraphQL"]
  },
  {
    id: 6,
    title: "Real Estate Listing App",
    category: "06 / Full Stack",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
    desc: "Property discovery marketplace featuring Mapbox interactive geolocation search, 360-degree virtual room tours, mortgage estimation calculator, and agent booking.",
    techs: ["React", "Node.js", "Mapbox"]
  },
  {
    id: 7,
    title: "Fitness Tracker App",
    category: "07 / Health Tech",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    desc: "Personal health & fitness mobile application logging daily workouts, body metric progression charts, customized AI coaching routines, and cloud sync.",
    techs: ["React Native", "Firebase"]
  },
  {
    id: 8,
    title: "AI Chat Interface",
    category: "08 / AI / ML",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
    desc: "Sleek user interface for Large Language Models supporting conversation history branching, real-time response streaming, code syntax highlighting, and custom prompt templates.",
    techs: ["React", "OpenAI API", "Python"]
  }
];

export default function Projects() {
  const [modalProject, setModalProject] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const modalRef = useRef(null);
  const modalCardRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = track.querySelectorAll('.proj-card');
    const totalCards = cards.length;

    const getScrollDist = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const updateSectionHeight = () => {
      section.style.height = (getScrollDist() + window.innerHeight) + 'px';
    };

    updateSectionHeight();
    window.addEventListener('resize', updateSectionHeight);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => '+=' + getScrollDist(),
        pin: '#proj-pin-wrap',
        anticipatePin: 1,
        scrub: true,
        onUpdate(self) {
          const dist = getScrollDist();
          const x = -(self.progress * dist);
          gsap.set(track, { x });

          setScrollProgress(self.progress);

          const idx = Math.min(Math.floor(self.progress * totalCards) + 1, totalCards);
          setCurrentIndex(idx);

          const viewportCenter = window.innerWidth / 2;
          cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distFromCenter = Math.abs(viewportCenter - cardCenter);
            const maxDist = window.innerWidth * 0.6;
            const normDist = Math.min(distFromCenter / maxDist, 1);

            const scale = 1 - normDist * 0.08;
            const rotation = (cardCenter - viewportCenter) * -0.015;

            gsap.set(card, {
              scale: scale,
              rotationY: Math.max(-12, Math.min(12, rotation)),
              transformPerspective: 1000
            });
          });
        }
      });

      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true }
        }
      );

      cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            rotationY: x * 0.04,
            rotationX: -y * 0.04,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power1.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', updateSectionHeight);
    };
  }, []);

  const openModal = (proj) => {
    setModalProject(proj);
    const modal = modalRef.current;
    const card = modalCardRef.current;

    gsap.set(modal, { display: 'flex' });
    gsap.to(modal, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(card,
      { scale: 0.85, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
    );
  };

  const closeModal = () => {
    const modal = modalRef.current;
    const card = modalCardRef.current;

    gsap.to(card, { scale: 0.9, y: 20, opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(modal, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        gsap.set(modal, { display: 'none' });
        setModalProject(null);
      }
    });
  };

  return (
    <section id="projects" ref={sectionRef} className="relative bg-[#111] text-white overflow-hidden">
      <div id="proj-pin-wrap" className="sticky top-0 h-screen overflow-hidden flex items-center">
        
        <div id="proj-label" className="absolute left-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35">
            Featured Projects
          </div>
        </div>

        <div id="proj-track" ref={trackRef} className="flex gap-8 px-32 will-change-transform">
          {PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="proj-card flex-shrink-0 w-[520px] bg-[#f9f4eb] rounded-[24px] border-2 border-black/10 overflow-hidden relative shadow-2xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="proj-img w-full h-full object-cover transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 font-mono text-[10px] font-bold tracking-wider uppercase bg-[#111] text-accent3 px-3 py-1.5 rounded-full">
                  {proj.category}
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-[1.6rem] font-extrabold tracking-tight text-[#111] mb-2">{proj.title}</h3>
                <p className="text-[0.92rem] text-black/75 font-medium leading-relaxed mb-5">{proj.desc}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.techs.map((t, index) => (
                    <span
                      key={index}
                      className="font-mono text-[10px] font-bold px-3 py-1 rounded-full bg-black/5 text-[#111] border border-black/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => openModal(proj)}
                  className="proj-action-btn inline-flex items-center gap-2.5 font-mono text-[0.75rem] font-bold uppercase tracking-wider text-[#111] bg-black/5 border-2 border-[#111] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300"
                >
                  View Details <i className="fas fa-arrow-right text-[0.7rem]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div id="proj-scroll-hint" className="absolute bottom-10 right-12 flex items-center gap-2.5 font-mono text-[10px] tracking-wider uppercase text-white/35">
          <span id="proj-counter" className="text-white/60">{String(currentIndex).padStart(2, '0')}</span> / {String(PROJECTS.length).padStart(2, '0')}
          <div className="w-[60px] h-[1px] bg-white/15 relative overflow-hidden">
            <div
              id="proj-progress-bar"
              style={{ width: `${scrollProgress * 100}%` }}
              className="absolute left-0 top-0 h-full bg-white transition-all duration-150 ease-out"
            ></div>
          </div>
          scroll →
        </div>

      </div>

      <div
        id="proj-modal"
        ref={modalRef}
        style={{ display: 'none', opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-[12px] flex items-center justify-center p-8"
      >
        {modalProject && (
          <div
            id="proj-modal-card"
            ref={modalCardRef}
            className="bg-[#f9f4eb] text-[#111] max-w-[700px] w-full rounded-[24px] border-3 border-[#111] overflow-hidden shadow-2xl relative"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#111] text-white border-none cursor-pointer text-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
              ✕
            </button>
            <div className="aspect-video overflow-hidden relative">
              <img
                src={modalProject.img}
                alt={modalProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 font-mono text-[10px] font-bold tracking-wider uppercase bg-[#111] text-accent1 px-3 py-1.5 rounded-full">
                {modalProject.category}
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#111] mb-2">{modalProject.title}</h2>
              <p className="text-[0.95rem] text-black/75 font-medium leading-relaxed mb-6">{modalProject.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {modalProject.techs.map((t, index) => (
                  <span
                    key={index}
                    className="font-mono text-[10px] font-bold px-3.5 py-1.5 rounded-full bg-black/5 text-[#111] border border-black/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="font-mono text-[0.75rem] font-bold uppercase tracking-wider px-6 py-3 rounded-full bg-[#111] text-white border-none cursor-pointer transition-all duration-200 hover:opacity-90"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
