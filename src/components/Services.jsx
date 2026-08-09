import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const smoothStep = (p) => p * p * (3 - 2 * p);

      const updateCards = (progress) => {
        const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);

        gsap.set(".services-header", {
          y: gsap.utils.interpolate("400%", "0%", smoothStep(headerProgress)),
          force3D: true,
        });

        ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
          const isMobile = window.innerWidth <= 768;
          const delay = isMobile ? 0 : index * 0.5;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1));

          const innerCard = document.querySelector(`${cardId} .flip-card-inner`);
          if (!innerCard) return;

          const entryProgress = isMobile
            ? gsap.utils.clamp(0, 1, progress / 0.9)
            : cardProgress;

          let baseY;
          if (entryProgress < 0.4) {
            baseY = gsap.utils.interpolate(-250, 50, smoothStep(entryProgress / 0.4));
          } else if (entryProgress < 0.6) {
            baseY = gsap.utils.interpolate(50, 0, smoothStep((entryProgress - 0.4) / 0.2));
          } else {
            baseY = 0;
          }

          let mult = cardProgress < 0.6
            ? 1
            : cardProgress < 1
            ? 1 - smoothStep((cardProgress - 0.6) / 0.4)
            : 0;

          let y;
          if (isMobile) {
            if (index === 0) {
              y = `calc(${baseY}% + ${mult * 100}% + ${mult * 1.2}rem)`;
            } else if (index === 1) {
              y = `${baseY}%`;
            } else {
              y = `calc(${baseY}% - ${mult * 100}% - ${mult * 1.2}rem)`;
            }
          } else {
            y = baseY + "%";
          }

          const scale = entryProgress < 0.4
            ? gsap.utils.interpolate(0.25, 0.75, smoothStep(entryProgress / 0.4))
            : entryProgress < 0.6
            ? gsap.utils.interpolate(0.75, 1, smoothStep((entryProgress - 0.4) / 0.2))
            : 1;

          const opacity = entryProgress < 0.2
            ? smoothStep(entryProgress / 0.2)
            : 1;

          let x, rotate, rotationY;
          if (isMobile) {
            x = "0%";
            if (cardProgress < 0.6) {
              rotate = 0;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const normalizedProgress = (cardProgress - 0.6) / 0.4;
              rotate = 0;
              rotationY = smoothStep(normalizedProgress) * 180;
            } else {
              rotate = 0;
              rotationY = 180;
            }
          } else {
            if (cardProgress < 0.6) {
              x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
              rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
              rotationY = 0;
            } else if (cardProgress < 1) {
              const normalizedProgress = (cardProgress - 0.6) / 0.4;
              x = gsap.utils.interpolate(
                index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
                "0%",
                smoothStep(normalizedProgress)
              );
              rotate = gsap.utils.interpolate(
                index === 0 ? -5 : index === 1 ? 0 : 5,
                0,
                smoothStep(normalizedProgress)
              );
              rotationY = smoothStep(normalizedProgress) * 180;
            } else {
              x = "0%";
              rotate = 0;
              rotationY = 180;
            }
          }

          const cardEl = document.querySelector(cardId);
          if (cardEl) {
            gsap.set(cardId, {
              opacity: opacity,
              y: y,
              x: x,
              rotate: rotate,
              scale: scale,
              force3D: true,
            });
          }

          gsap.set(innerCard, {
            rotationY: rotationY,
            force3D: true,
          });
        });
      };

      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: () => `+=${window.innerHeight * 4}px`,
        pin: ".services",
        pinSpacing: true,
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: () => `+=${window.innerHeight * 4}px`,
        onLeave: () => {
          const servicesSection = document.querySelector(".services");
          if (!servicesSection) return;
          const servicesRect = servicesSection.getBoundingClientRect();
          const servicesTop = window.scrollY + servicesRect.top;
          gsap.set(".cards", {
            position: "absolute",
            top: servicesTop,
            left: 0,
            width: "100vw",
            height: "100vh",
            force3D: true,
          });
        },
        onEnterBack: () => {
          gsap.set(".cards", {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            force3D: true,
          });
        },
      });

      ScrollTrigger.create({
        trigger: ".services",
        start: "top bottom",
        end: () => `+=${window.innerHeight * 4}px`,
        scrub: true,
        onUpdate: (self) => {
          updateCards(self.progress);
        },
      });

      updateCards(0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section className="services" id="services">
        <div className="services-header">
          <h1 style={{ fontWeight: 600 }}>
            Solutions I Build So You Can Focus on What Matters
          </h1>
        </div>
      </section>

      <section className="cards">
        <div className="cards-container">
          
          <div className="card" id="card-1">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Programming</span>
                    <span>01</span>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Programming</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Programming</span>
                    <span>01</span>
                  </div>
                  <div className="card-copy">
                    <p>Web Development</p>
                    <p>Database Management</p>
                    <p>Object-Oriented Programming</p>
                    <p>API Development & Integration</p>
                    <p>Single Page Development</p>
                    <p>Semantic MarkUp</p>
                  </div>
                  <div className="card-title">
                    <span>01</span>
                    <span>Programming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Design</span>
                    <span>02</span>
                  </div>
                  <div className="card-copy">
                    <p>UI UX Design</p>
                    <p>Responsive Layout Creation</p>
                    <p>Digital Visual Design</p>
                    <p>Color Theory & Typography Principles</p>
                    <p>Interactive Prototyping</p>
                    <p>Visual Branding</p>
                  </div>
                  <div className="card-title">
                    <span>02</span>
                    <span>Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>Others</span>
                    <span>03</span>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Others</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>Others</span>
                    <span>03</span>
                  </div>
                  <div className="card-copy">
                    <p>Collaborative Development</p>
                    <p>Basic Cybersecurity Practices</p>
                    <p>Structured IT Project Management</p>
                    <p>Basic Machine Learning</p>
                    <p>Web Performance Optimization</p>
                    <p>Debugging & Troubleshooting</p>
                  </div>
                  <div className="card-title">
                    <span>03</span>
                    <span>Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
