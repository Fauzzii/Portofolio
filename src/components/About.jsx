import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const cardSwapRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: leftRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          }
        }
      );

      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rightRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          }
        }
      );

      const cards = cardSwapRef.current.querySelectorAll('.gulir');
      const totalCards = cards.length;
      if (!totalCards) return;

      const config = {
        cardDistance: 60,
        verticalDistance: 70,
        delay: 5000,
        skewAmount: 6,
        animationConfig: {
          ease: "elastic.out(0.6, 0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      };

      const makeSlot = (i, distX, distY, total) => ({
        x: i * distX,
        y: -i * distY,
        z: -i * distX * 1.5,
        zIndex: total - i,
      });

      cards.forEach((card, i) => {
        const slot = makeSlot(i, config.cardDistance, config.verticalDistance, totalCards);
        gsap.set(card, {
          x: 0,
          y: 600,
          z: -300,
          xPercent: -50,
          yPercent: -50,
          skewY: 0,
          opacity: 0,
          transformOrigin: "center center",
          zIndex: slot.zIndex,
          force3D: true,
        });
      });

      let order = Array.from({ length: totalCards }, (_, i) => i);

      const swap = () => {
        if (order.length < 2) return;

        const [front, ...rest] = order;
        const elFront = cards[front];
        const tl = gsap.timeline();

        tl.to(elFront, {
          y: "+=500",
          duration: config.animationConfig.durDrop,
          ease: config.animationConfig.ease,
        });

        tl.add(
          "promote",
          `-=${config.animationConfig.durDrop * config.animationConfig.promoteOverlap}`
        );

        rest.forEach((idx, i) => {
          const el = cards[idx];
          const slot = makeSlot(i, config.cardDistance, config.verticalDistance, totalCards);

          tl.set(el, { zIndex: slot.zIndex }, "promote");
          tl.to(el, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.animationConfig.durMove,
            ease: config.animationConfig.ease,
          }, `promote+=${i * 0.15}`);
        });

        const backSlot = makeSlot(totalCards - 1, config.cardDistance, config.verticalDistance, totalCards);
        tl.add("return", `promote+=${config.animationConfig.durMove * config.animationConfig.returnDelay}`);
        tl.set(elFront, { zIndex: backSlot.zIndex }, "return");
        tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
        tl.to(elFront, {
          y: backSlot.y,
          duration: config.animationConfig.durReturn,
          ease: config.animationConfig.ease,
        }, "return");

        tl.call(() => {
          order = [...rest, front];
        });
      };

      gsap.to(cards, {
        scrollTrigger: {
          trigger: cardSwapRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        x: (i) => makeSlot(i, config.cardDistance, config.verticalDistance, totalCards).x,
        y: (i) => makeSlot(i, config.cardDistance, config.verticalDistance, totalCards).y,
        z: (i) => makeSlot(i, config.cardDistance, config.verticalDistance, totalCards).z,
        skewY: config.skewAmount,
        opacity: 1,
        duration: 1.4,
        stagger: 0.25,
        ease: "power3.out",
        onComplete: () => {
          intervalRef.current = setInterval(swap, config.delay);
        }
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-bg-grid"></div>

      <div className="left reveal-left" ref={leftRef}>
        <h1 className="reveal">
          From crafting responsive front-end interfaces to developing robust back-end systems, I enjoy bringing complete digital solutions to life. I work with modern tools and frameworks to create applications that are fast, secure, and user-focused.
        </h1>
      </div>

      <div className="right reveal-right" ref={rightRef}>
        <div className="container">
          <div className="card-swap" ref={cardSwapRef}>

            <div className="gulir bg-accent1 border-2 border-black/10 text-black">
              <div className="flex flex-col h-full justify-between p-6">
                <div className="flex justify-between items-center border-b border-black/10 pb-4">
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">01 / PHILOSOPHY</span>
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">[ CORE ]</span>
                </div>
                <div className="my-auto py-2">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black leading-snug tracking-tight my-0">
                    "Crafting digital experiences that balance clean aesthetics with robust, high-performance code."
                  </h3>
                </div>
                <div className="flex justify-between items-center border-t border-black/10 pt-4">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">FAUZI EKA PUTRA</span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">© 2026</span>
                </div>
              </div>
            </div>

            <div className="gulir bg-accent2 border-2 border-black/10 text-black">
              <div className="flex flex-col h-full justify-between p-6">
                <div className="flex justify-between items-center border-b border-black/10 pb-4">
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">02 / SERVICES</span>
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">[ WEB DEV ]</span>
                </div>
                <div className="my-auto py-2 flex flex-col gap-2">
                  <p className="text-sm md:text-base font-semibold text-black/80 my-0 leading-relaxed">
                    Transforming complex wireframes into production-ready frontends, and building scalable backends with RESTful APIs.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-black/5 rounded px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold text-black/75">✦ Web Development</div>
                    <div className="bg-black/5 rounded px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold text-black/75">✦ Database Management</div>
                    <div className="bg-black/5 rounded px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold text-black/75">✦ UI/UX Implementation</div>
                    <div className="bg-black/5 rounded px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold text-black/75">✦ API Integrations</div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-black/10 pt-4">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">CAPABILITIES</span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">END-TO-END</span>
                </div>
              </div>
            </div>

            <div className="gulir bg-accent3 border-2 border-black/10 text-black">
              <div className="flex flex-col h-full justify-between p-6">
                <div className="flex justify-between items-center border-b border-black/10 pb-4">
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">03 / TECH MATRIX</span>
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-black/60 font-semibold">[ MODERN STACK ]</span>
                </div>
                <div className="my-auto py-2">
                  <p className="text-sm md:text-base font-semibold text-black/80 mb-3 my-0 leading-relaxed">
                    Leveraging robust frameworks and agile toolsets to deploy highly optimized user interfaces.
                  </p>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">React.js</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">Vue.js</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">Node.js</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">MongoDB</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">PostgreSQL</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">Tailwind CSS</span>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-mono font-bold rounded bg-black text-[#fcdca6]">Figma</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-black/10 pt-4">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">MODERN STACK</span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-black/60 font-semibold">TOOLBOX</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
