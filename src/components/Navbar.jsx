import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import ScrambleText from './ScrambleText';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarWrapperRef = useRef(null);
  
  useEffect(() => {
    const wrapper = navbarWrapperRef.current;
    if (!wrapper) return;

    let lastScrollY = window.scrollY;
    let isHidden = false;

    gsap.set(wrapper, { y: 0, force3D: true });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > 60);

      if (currentScrollY > 50 && scrollDelta > 1 && !isHidden) {
        isHidden = true;
        gsap.to(wrapper, {
          y: -140,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto"
        });
      } else if ((scrollDelta < -1 || currentScrollY <= 20) && isHidden) {
        isHidden = false;
        gsap.to(wrapper, {
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto"
        });
      }

      lastScrollY = Math.max(0, currentScrollY);

      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 250;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (e, href) => {
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

  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header ref={navbarWrapperRef} className="navbar-wrapper">
      <nav className={`navbar-glass ${isScrolled ? 'scrolled' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); window.lenis?.scrollTo(0); }} className="nav-brand">
          <ScrambleText text="FAUZI EKA PUTRA" /> <span className="nav-brand-badge">DEV</span>
        </a>
        
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                <ScrambleText text={item.label} duration={400} />
              </a>
            </li>
          ))}
        </ul>
        
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="nav-cta-btn"
        >
          <ScrambleText text="Let's Talk ✦" duration={500} />
        </a>
      </nav>
    </header>
  );
}
