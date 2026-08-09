import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

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

      if (currentScrollY > 100 && scrollDelta > 8 && !isHidden) {
        isHidden = true;
        gsap.to(wrapper, {
          y: -140,
          duration: 0.5,
          ease: "back.in(1.7)",
          overwrite: "auto"
        });
      } else if ((scrollDelta < -8 || currentScrollY <= 50) && isHidden) {
        isHidden = false;
        gsap.to(wrapper, {
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
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
        <a href="#" className="nav-brand">
          <span>FAUZI EKA PUTRA</span> <span class="nav-brand-badge">DEV</span>
        </a>
        
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        
        <a href="#contact" className="nav-cta-btn">Let's Talk ✦</a>
      </nav>
    </header>
  );
}
