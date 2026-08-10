import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import Marquee from './components/Marquee';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      wheelMultiplier: 0.5,
    });
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    window.addEventListener('load', () => ScrollTrigger.refresh());

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    gsap.fromTo('body', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    // Fixed scroll progress bar animation at the top of the viewport
    const bar = document.querySelector('.scroll-progress-bar');
    if (bar) {
      gsap.fromTo(bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          }
        }
      );
    }
  }, [loading]);

  return (
    <>
      {!loading && (
        <div className="scroll-progress-bar fixed top-0 left-0 right-0 h-1 bg-[#22d3ee] origin-left z-[10001] scale-x-0" />
      )}
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <CursorGlow />
      <Navbar />
      <main>
        <Hero isLoading={loading} />
        <About />
        <Services />
        <Marquee />
        <Projects />
        <Experience />
        <Stats />
        <Contact />
      </main>
    </>
  );
}
