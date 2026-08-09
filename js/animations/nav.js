document.addEventListener('DOMContentLoaded', () => {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navbarGlass = document.querySelector('.navbar-glass');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbarWrapper) return;

  let lastScrollY = window.scrollY;
  let isHidden = false;

  // Initialize wrapper transform state for GPU acceleration
  gsap.set(navbarWrapper, { y: 0, force3D: true });

  const handleNavbarVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    // Toggle glass shadow background past top area
    if (currentScrollY > 60) {
      navbarGlass?.classList.add('scrolled');
    } else {
      navbarGlass?.classList.remove('scrolled');
    }

    // Scroll Down -> Hide Upward with Bounce (back.in)
    if (currentScrollY > 100 && scrollDelta > 8 && !isHidden) {
      isHidden = true;
      gsap.to(navbarWrapper, {
        y: -140,
        duration: 0.5,
        ease: "back.in(1.7)",
        overwrite: "auto"
      });
    }
    // Scroll Up -> Show Downward with Bounce (back.out)
    else if ((scrollDelta < -8 || currentScrollY <= 50) && isHidden) {
      isHidden = false;
      gsap.to(navbarWrapper, {
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        overwrite: "auto"
      });
    }

    lastScrollY = Math.max(0, currentScrollY);
  };

  window.addEventListener('scroll', handleNavbarVisibility, { passive: true });

  // ScrollSpy: Active Section Highlight
  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 250;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (id && link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
});
