import { useEffect } from 'react';
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

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      wheelMultiplier: 0.5,
    });

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

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Experience />
        <Stats />
        <Contact />
      </main>
    </>
  );
}
