const PROJECT_DATA = {
  1: {
    title: "E-Commerce Platform",
    category: "01 / Web Development",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    desc: "A full-featured digital shop equipped with Stripe payment gateway, real-time inventory management, responsive cart experience, and a high-performance admin dashboard built for enterprise workloads.",
    techs: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"]
  },
  2: {
    title: "Task Management App",
    category: "02 / Mobile App",
    img: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=900&q=80",
    desc: "Collaborative project tracking application featuring real-time WebSockets synchronization, drag-and-drop Kanban boards, sprint planning modules, and automated team notifications.",
    techs: ["Vue.js", "Socket.io", "PostgreSQL", "Express.js"]
  },
  3: {
    title: "Weather Dashboard",
    category: "03 / Data Visualization",
    img: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=900&q=80",
    desc: "Live meteorology interface tracking global weather patterns, 7-day radar forecasts, atmospheric data graphs using Chart.js, and offline PWA capability.",
    techs: ["JavaScript", "Chart.js", "PWA", "OpenWeather API"]
  },
  4: {
    title: "Blog & CMS Platform",
    category: "04 / Content System",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
    desc: "Modern headless content management platform with rich markdown editor, Sanity.io backend integration, automated SEO meta tags, and role-based permissions.",
    techs: ["Next.js", "Sanity.io", "TypeScript", "Tailwind CSS"]
  },
  5: {
    title: "Social Media Analytics",
    category: "05 / Analytics",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80",
    desc: "Unified analytics dashboard tracking audience engagement metrics, post reach, and follower conversion trends across multiple social APIs in real-time.",
    techs: ["React", "D3.js", "GraphQL", "Node.js"]
  },
  6: {
    title: "Real Estate Listing App",
    category: "06 / Full Stack",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
    desc: "Property discovery marketplace featuring Mapbox interactive geolocation search, 360-degree virtual room tours, mortgage estimation calculator, and agent booking.",
    techs: ["React", "Node.js", "Mapbox", "Express.js"]
  },
  7: {
    title: "Fitness Tracker App",
    category: "07 / Health Tech",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    desc: "Personal health & fitness mobile application logging daily workouts, body metric progression charts, customized AI coaching routines, and cloud sync.",
    techs: ["React Native", "Firebase", "Redux Toolkit"]
  },
  8: {
    title: "AI Chat Interface",
    category: "08 / Artificial Intelligence",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80",
    desc: "Sleek user interface for Large Language Models supporting conversation history branching, real-time response streaming, code syntax highlighting, and custom prompt templates.",
    techs: ["React", "OpenAI API", "Python", "FastAPI"]
  }
};

function initProjectsScroll() {
  const section = document.getElementById('projects');
  const track = document.getElementById('proj-track');
  const counter = document.getElementById('proj-counter');
  const bar = document.getElementById('proj-progress-bar');
  if (!section || !track) return;

  const cards = track.querySelectorAll('.proj-card');
  const totalCards = cards.length;

  const getScrollDist = () => {
    return Math.max(0, track.scrollWidth - window.innerWidth);
  };

  const updateSectionHeight = () => {
    section.style.height = (getScrollDist() + window.innerHeight) + 'px';
  };

  updateSectionHeight();

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

      const idx = Math.min(Math.floor(self.progress * totalCards) + 1, totalCards);
      if (counter) counter.textContent = String(idx).padStart(2, '0');
      if (bar) bar.style.width = (self.progress * 100) + '%';

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

  window.addEventListener('resize', updateSectionHeight);

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
}

function openProjectModal(id) {
  const data = PROJECT_DATA[id];
  if (!data) return;

  const modal = document.getElementById('proj-modal');
  const card = document.getElementById('proj-modal-card');
  const img = document.getElementById('modal-img');
  const tag = document.getElementById('modal-tag');
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-desc');
  const techsWrap = document.getElementById('modal-techs');

  if (!modal || !data) return;

  img.src = data.img;
  tag.textContent = data.category;
  title.textContent = data.title;
  desc.textContent = data.desc;

  techsWrap.innerHTML = data.techs.map(t =>
    `<span style="font-family:'DM Mono',monospace;font-size:0.7rem;font-weight:700;padding:0.35rem 0.85rem;border-radius:999px;background:rgba(0,0,0,0.08);color:#111;border:1.5px solid rgba(0,0,0,0.15);">${t}</span>`
  ).join('');

  modal.style.display = 'flex';
  gsap.to(modal, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  gsap.fromTo(card,
    { scale: 0.85, y: 30, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
  );
}

function closeProjectModal() {
  const modal = document.getElementById('proj-modal');
  const card = document.getElementById('proj-modal-card');
  if (!modal) return;

  gsap.to(card, { scale: 0.9, y: 20, opacity: 0, duration: 0.25, ease: 'power2.in' });
  gsap.to(modal, {
    opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => { modal.style.display = 'none'; }
  });
}
