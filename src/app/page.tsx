"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { SiGooglescholar } from "react-icons/si";

/* ------------------------------------------------------------------ */
/* Declare globals loaded via CDN <script> tags                       */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    LocomotiveScroll: any;
  }
}

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locoScrollRef = useRef<any>(null);

  useEffect(() => {
    /* Wait for GSAP + Locomotive CDN scripts to load */
    const waitForLibs = setInterval(() => {
      if (window.gsap && window.ScrollTrigger && window.LocomotiveScroll) {
        clearInterval(waitForLibs);
        initSite();
      }
    }, 100);

    return () => clearInterval(waitForLibs);
  }, []);

  function initSite() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    /* ============================================================
       CANVAS PRELOADER ANIMATION
       ============================================================ */
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
    if (canvas) {
      const context = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const frameCount = 97;
      const currentFrame = (index: number) => (
        `/hero_animation/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.png`
      );

      const images: HTMLImageElement[] = [];
      const sequence = { frame: 0 };

      // Make sure images load initially
      let loadedImages = 0;
      let animationStarted = false;

      for (let i = 0; i < frameCount; i++) {
        const img = new window.Image();
        img.onload = () => {
          loadedImages++;
          if (loadedImages > 5 && !animationStarted) {
            animationStarted = true;
            startAnimation();
          }
        };
        img.src = currentFrame(i);
        images.push(img);
      }

      function render() {
        if (!context || !canvas) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        const img = images[sequence.frame];
        if (img && img.complete && img.naturalWidth !== 0) {
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.max(hRatio, vRatio);
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;
          context.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        }
      }

      function startAnimation() {
        gsap.to(sequence, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          duration: 4, // 4 seconds animation
          onUpdate: render,
          onComplete: () => {
            gsap.to(".preloader", {
              opacity: 0,
              duration: 1,
              onComplete: () => {
                const preloader = document.querySelector<HTMLElement>(".preloader");
                if (preloader) preloader.style.display = "none";

                gsap.to(".main-content", {
                  opacity: 1,
                  duration: 1,
                  ease: "power2.out",
                });

                initLocomotive();
                initAnimations();
              },
            });
          }
        });
      }

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      });
    }

    /* ============================================================
       LOCOMOTIVE SCROLL
       ============================================================ */
    function initLocomotive() {
      const container = scrollContainerRef.current;
      if (!container) return;

      const locoScroll = new window.LocomotiveScroll({
        el: container,
        smooth: true,
        multiplier: 1.0,
        lerp: 0.1,
        touchMultiplier: 3.5,
        tablet: {
          smooth: true,
          breakpoint: 0,
          lerp: 0.15
        },
        smartphone: {
          smooth: true,
          breakpoint: 0,
          lerp: 0.18
        }
      });

      locoScrollRef.current = locoScroll;

      locoScroll.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(container, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) {
            locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
          }
          return locoScroll.scroll?.instance?.scroll?.y ?? 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: container.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      ScrollTrigger.defaults({ scroller: container });
      ScrollTrigger.refresh();
    }

    /* ============================================================
       GSAP ANIMATIONS
       ============================================================ */
    function initAnimations() {
      /* --- Floating orbs --- */
      (gsap.utils.toArray(".glow-orb") as HTMLElement[]).forEach((orb: HTMLElement, i: number) => {
        gsap.to(orb, {
          y: -20,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      });

      /* --- Hero text --- */
      gsap.from(".hero__title", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      /* --- Bell Curve Breathing --- */
      gsap.to(".bell-curve", {
        y: 15,
        opacity: 0.6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      gsap.from(".hero__subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".hero__ctas .btn", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out",
      });

      /* --- About section (Row Alignment) --- */
      const aboutRows = gsap.utils.toArray(".about__bio p") as HTMLElement[];
      aboutRows.forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      });

      gsap.from(".about__photo-wrap", {
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about__bio > *", {
        scrollTrigger: {
          trigger: ".about__bio",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });

      /* --- Education timeline (CDF Step Chart) --- */
      const timelinePath = document.querySelector(".timeline-path") as SVGPathElement;
      if (timelinePath) {
        const pathLength = timelinePath.getTotalLength();
        gsap.set(timelinePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(timelinePath, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: ".education__timeline",
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1,
          },
          ease: "none",
        });
      }

      (gsap.utils.toArray(".education__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });

      /* --- Teaching cards --- */
      (gsap.utils.toArray(".teaching__card") as HTMLElement[]).forEach((card: HTMLElement, i: number) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      /* --- Research grid items --- */
      (gsap.utils.toArray(".research__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "back.out(1.4)",
        });
      });

      /* --- Publication items (Correlation Thread) --- */
      (gsap.utils.toArray(".pub__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power3.out",
        });

        // Correlation thread tracking
        ScrollTrigger.create({
          trigger: item,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => {
            gsap.to(".pub__thread-pointer", {
              y: item.offsetTop - (document.querySelector(".publications__list") as HTMLElement).offsetTop,
              duration: 0.4,
              ease: "back.out(1.7)"
            });
            gsap.to(item, { backgroundColor: "rgba(255, 140, 0, 0.08)", duration: 0.3 });
          },
          onLeave: () => {
            gsap.to(item, { backgroundColor: "transparent", duration: 0.3 });
          },
          onEnterBack: () => {
            gsap.to(".pub__thread-pointer", {
              y: item.offsetTop - (document.querySelector(".publications__list") as HTMLElement).offsetTop,
              duration: 0.4,
              ease: "back.out(1.7)"
            });
            gsap.to(item, { backgroundColor: "rgba(255, 140, 0, 0.08)", duration: 0.3 });
          },
          onLeaveBack: () => {
            gsap.to(item, { backgroundColor: "transparent", duration: 0.3 });
          }
        });
      });

      /* --- Holographic Tilt for Cards --- */
      const cards = gsap.utils.toArray(".glass-card") as HTMLElement[];
      cards.forEach((card) => {
        const glimmer = card.querySelector(".glimmer-overlay") as HTMLElement;

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: "power2.out",
            perspective: 1000,
          });

          if (glimmer) {
            gsap.to(glimmer, {
              opacity: 0.4,
              x: x - rect.width / 2,
              y: y - rect.height / 2,
              duration: 0.2,
            });
          }
        });

        card.addEventListener("mousedown", () => {
          gsap.to(card, {
            scale: 0.96,
            boxShadow: "0 4px 20px rgba(255, 140, 0, 0.4)",
            duration: 0.2,
            ease: "power2.out",
          });
          if (glimmer) {
            gsap.to(glimmer, { opacity: 0.8, duration: 0.2 });
          }
        });

        card.addEventListener("mouseup", () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 8px 40px rgba(255, 140, 0, 0.12)",
            duration: 0.4,
            ease: "back.out(2)",
          });
          if (glimmer) {
            gsap.to(glimmer, { opacity: 0.4, duration: 0.4 });
          }
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            boxShadow: "none",
            duration: 0.5,
            ease: "power2.out",
          });
          if (glimmer) {
            gsap.to(glimmer, { opacity: 0, duration: 0.5 });
          }
        });
      });
      (gsap.utils.toArray(".section__label, .section__title, .section__desc") as HTMLElement[]).forEach((el: HTMLElement) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      /* --- Contact inputs --- */
      (gsap.utils.toArray(".contact__input, .contact__textarea") as HTMLElement[]).forEach((el: HTMLElement, i: number) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
          x: -40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      gsap.from(".contact__submit", {
        scrollTrigger: {
          trigger: ".contact__submit",
          start: "top 92%",
          toggleActions: "play reverse play reverse",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      /* --- Footer --- */
      gsap.from(".footer > *", {
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }

  /* ============================================================
     HAMBURGER TOGGLE
     ============================================================ */
  function toggleMenu() {
    document.querySelector(".nav__hamburger")?.classList.toggle("active");
    document.querySelector(".nav__mobile-menu")?.classList.toggle("active");
  }

  function closeMenu() {
    document.querySelector(".nav__hamburger")?.classList.remove("active");
    document.querySelector(".nav__mobile-menu")?.classList.remove("active");
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    e.preventDefault();
    closeMenu();
    if (locoScrollRef.current) {
      locoScrollRef.current.scrollTo(targetId, { offset: -80, duration: 1.2 });
    }
  }

  /* ============================================================
     CONTACT FORM SUBMIT
     ============================================================ */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const btn = document.querySelector<HTMLElement>(".contact__submit");
    if (btn && window.gsap) {
      window.gsap.fromTo(
        btn,
        { scale: 0.95 },
        {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }

  /* ============================================================
     FOOTER PARTICLES (generate positions)
     ============================================================ */
  // Use deterministic values to avoid SSR/client hydration mismatch
  const particles = Array.from({ length: 30 }, (_, i) => {
    const hash1 = ((i * 2654435761) >>> 0) / 4294967296;
    const hash2 = ((i * 2246822519 + 1) >>> 0) / 4294967296;
    const hash3 = ((i * 3266489917 + 2) >>> 0) / 4294967296;
    const hash4 = ((i * 668265263 + 3) >>> 0) / 4294967296;
    return {
      id: i,
      left: `${(hash1 * 100).toFixed(4)}%`,
      top: `${(hash2 * 100).toFixed(4)}%`,
      animDelay: `${(hash3 * 4).toFixed(4)}s`,
      size: `${(1 + hash4 * 2).toFixed(4)}px`,
    };
  });

  return (
    <>
      {/* ============================
          PRELOADER
          ============================ */}
      <div className="preloader" style={{ background: "#000", padding: 0 }}>
        <canvas id="hero-canvas" style={{ width: "100vw", height: "100vh", display: "block", objectFit: "cover" }} />
      </div>

      {/* ============================
          NAVIGATION
          ============================ */}
      <nav className="nav">
        <div className="nav__logo">
          B<span>.</span>K<span>.</span> Jha
        </div>
        <ul className="nav__links">
          <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a></li>
          <li><a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a></li>
          <li><a href="#teaching" onClick={(e) => handleNavClick(e, "#teaching")}>Teaching</a></li>
          <li><a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Research</a></li>
          <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a></li>
        </ul>
        <div className="nav__hamburger" onClick={toggleMenu}>
          <span /><span /><span />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="nav__mobile-menu">
        <a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a>
        <a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a>
        <a href="#teaching" onClick={(e) => handleNavClick(e, "#teaching")}>Teaching</a>
        <a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Research</a>
        <a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a>
        <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a>
      </div>

      {/* ============================
          MAIN CONTENT
          ============================ */}
      <div
        className="main-content"
        ref={scrollContainerRef}
        data-scroll-container
      >
        {/* ── HERO ── */}
        <section className="hero" id="hero" data-scroll-section>
          <div className="hero__pattern-bg">
            <svg className="bell-curve" viewBox="0 0 1000 500" preserveAspectRatio="none">
              <path
                d="M 0 450 C 150 450, 350 450, 500 100 S 850 450, 1000 450"
                fill="none"
                stroke="var(--accent-orange)"
                strokeWidth="4"
                opacity="0.7"
              />
            </svg>
          </div>
          <div className="hero__overlay" />
          <div className="glow-orb glow-orb--1" />
          <div className="glow-orb glow-orb--2" />
          <div className="glow-orb glow-orb--3" />
          <div className="hero__content">
            <h1 className="hero__title">Dr. Brijesh Kumar Jha</h1>
            <p className="hero__subtitle">
              PhD in Statistics &nbsp;|&nbsp; Statistical Inference &nbsp;|&nbsp;
              Bayesian Estimation &nbsp;|&nbsp; Decision Theory
            </p>
            <div className="hero__ctas">
              <a href="#publications" className="btn btn--primary" onClick={(e) => handleNavClick(e, "#publications")}>
                View Research
              </a>
              <a href="#contact" className="btn btn--outline" onClick={(e) => handleNavClick(e, "#contact")}>
                Contact
              </a>
              <a
                href="https://www.linkedin.com/in/brijesh-kumar-jha-38a132131/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--icon btn--outline magnetic"
                title="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </section>

        {/* ── ABOUT / PROFILE ── */}
        <section className="section about" id="about" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Profile</div>
            <div className="section__title">About Me</div>
            <div className="about__grid">
              <div className="about__photo-wrap">
                <div className="about__photo-glow" />
                <Image
                  src="/profile-photo.jpg"
                  alt="Dr. Brijesh Kumar Jha"
                  width={400}
                  height={400}
                  className="about__photo"
                  priority
                />
              </div>
              <div className="about__bio">
                <h3>Academic &amp; Research Profile</h3>
                <p>
                  Dr. Brijesh Kumar Jha holds a <strong>PhD in Statistics</strong> from
                  Siksha &apos;O&apos; Anusandhan (Deemed to be University), Bhubaneswar,
                  with a research focus on Statistical Inference, Point Estimation,
                  Bayesian Estimation, and Decision Theory.
                </p>
                <p>
                  He completed his <strong>MSc in Statistics</strong> from Utkal
                  University, Bhubaneswar, and his <strong>BSc in Mathematics &amp;
                    Computing</strong> from the Institute of Mathematics and Applications,
                  Bhubaneswar.
                </p>
                <p>
                  He has pursued postdoctoral research at <strong>IIT Bhubaneswar</strong>{" "}
                  under an INSPIRE-funded project and is currently expanding his
                  research into <strong>Queuing Theory</strong> and{" "}
                  <strong>Econometrics</strong>.
                </p>
                <ul className="about__list">
                  <li>Statistical Inference &amp; Point Estimation</li>
                  <li>Bayesian Estimation &amp; Decision Theory</li>
                  <li>Postdoctoral Research — IIT Bhubaneswar (INSPIRE)</li>
                  <li>Current: Queuing Theory &amp; Econometrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── EDUCATION ── */}
        <section className="section" id="education" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Education</div>
            <div className="section__title">Academic Qualifications</div>
            <div className="education__timeline">
              <div className="timeline-svg-container">
                <svg width="100%" height="100%" viewBox="0 0 100 800" preserveAspectRatio="none">
                  <path
                    className="timeline-path-bg"
                    d="M10,0 V150 H90 V400 H10 V650 H90"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                  />
                  <path
                    className="timeline-path"
                    d="M10,0 V150 H90 V400 H10 V650 H90"
                    fill="none"
                    stroke="url(#timeline-grad)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent-cyan)" />
                      <stop offset="50%" stopColor="var(--accent-blue)" />
                      <stop offset="100%" stopColor="var(--accent-purple)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    Ph.D., Mathematical Statistics
                  </div>
                  <div className="education__institution">
                    SOA University (Siksha &apos;O&apos; Anusandhan)
                  </div>
                  <div className="education__location">Bhubaneswar, Odisha</div>
                  <div className="education__duration">Feb 2018 – Apr 2023</div>
                </div>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    Postgraduate Degree, Statistics
                  </div>
                  <div className="education__institution">
                    Utkal University
                  </div>
                  <div className="education__location">Bhubaneswar, Odisha</div>
                  <div className="education__duration">2012 – 2014</div>
                </div>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    Graduate, Mathematics and Computer Science
                  </div>
                  <div className="education__institution">
                    Institute of Mathematics and Applications
                  </div>
                  <div className="education__location">Bhubaneswar, Odisha</div>
                  <div className="education__duration">2009 – 2012</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEACHING EXPERIENCE ── */}
        <section className="section" id="teaching" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Experience</div>
            <div className="section__title">Teaching Experience</div>
            <div className="teaching__grid">
              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="teaching__role">INSPIRE Fellow (DST)</div>
                <div className="teaching__institution">
                  IIT Bhubaneswar
                </div>
                <div className="teaching__duration">
                  Postdoctoral Research
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="teaching__role">Assistant Professor</div>
                <div className="teaching__institution">
                  Siksha &apos;O&apos; Anusandhan (Deemed to be University)
                </div>
                <div className="teaching__duration">
                  Department of Mathematics
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="teaching__role">Guest Lecturer</div>
                <div className="teaching__institution">
                  Various Academic Institutions
                </div>
                <div className="teaching__duration">
                  Statistics &amp; Mathematics
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="teaching__role">Research Scholar</div>
                <div className="teaching__institution">
                  Siksha &apos;O&apos; Anusandhan (Deemed to be University)
                </div>
                <div className="teaching__duration">
                  PhD Research &amp; Teaching Assistance
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RESEARCH INTERESTS ── */}
        <section className="section" id="research" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Focus Areas</div>
            <div className="section__title">Research Interests</div>
            <div className="research__grid">
              {[
                { icon: "📐", name: "Point Estimation" },
                { icon: "📊", name: "Bayesian Estimation" },
                { icon: "⚖️", name: "Decision Theory" },
                { icon: "💻", name: "Data Science" },
                { icon: "🔄", name: "Queuing Theory" },
                { icon: "📈", name: "Econometrics" },
              ].map((item) => (
                <div className="research__item glass-card" key={item.name}>
                  <div className="glimmer-overlay" />
                  <span className="research__icon">{item.icon}</span>
                  <div className="research__name">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PUBLICATIONS ── */}
        <section className="section" id="publications" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Scholarly Work</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="section__title mb-0">Publications</div>
              <a
                href="https://scholar.google.com/citations?user=a7xV5KAAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="pub__scholar-link btn--outline btn--icon magnetic"
                title="Google Scholar Profile"
              >
                <SiGooglescholar size={20} />
              </a>
            </div>

            <div className="publications__list-wrapper">
              <div className="pub__thread">
                <div className="pub__thread-line" />
                <div className="pub__thread-pointer" />
              </div>
              <div className="publications__list">
                <div className="pub__category">Published</div>

                {[
                  {
                    title:
                      "Improved estimators of hazard rate from a selected exponential population",
                    year: "2023",
                    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:9yKSN-GCB0IC"
                  },
                  {
                    title:
                      "Inadmissibility results for selected hazard rates",
                    year: "2021",
                    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:u5HHmVD_uO8C"
                  },
                  {
                    title:
                      "Estimation of Reliability Following Selection from Pareto Populations",
                    year: "2021",
                    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:u-x6o8ySG0sC"
                  },
                  {
                    title:
                      "Estimation of Hazard Rate of a Selected Exponential Population",
                    year: "2020",
                    href: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:d1gkVwhDpl0C"
                  },
                  {
                    title:
                      "Reliability Estimation after Selection from One Parameter Exponential Population",
                    year: "2020",
                    href: "http://www.testmagzine.biz/index.php/testmagzine/article/view/10411"
                  },
                  {
                    title:
                      "Estimation of Hazard in Human Brain Signal Using Exponential Distribution",
                    year: "2019",
                    href: "https://www.ijstr.org/final-print/nov2019/Estimation-Of-Hazard-In-Human-Brain-Signal-Using-Exponential-Distribution.pdf"
                  },
                ].map((pub) => (
                  <div className="pub__item glass-card" key={pub.title}>
                    <div className="glimmer-overlay" />
                    <a href={pub.href} target="_blank" rel="noopener noreferrer" className="pub__link">
                      <div className="pub__title">{pub.title}</div>
                    </a>
                    <div className="pub__year">{pub.year}</div>
                  </div>
                ))}

                <div className="pub__category">Submitted</div>
                <div className="pub__item glass-card">
                  <div className="glimmer-overlay" />
                  <a href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:2osOgNQ5qMEC" target="_blank" rel="noopener noreferrer" className="pub__link">
                    <div className="pub__title">
                      Improving on admissible estimators under entropy loss function
                    </div>
                  </a>
                  <div className="pub__year">2024</div>
                </div>

                <div className="pub__category">Preprint</div>
                <div className="pub__item glass-card">
                  <div className="glimmer-overlay" />
                  <a href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=a7xV5KAAAAAJ&citation_for_view=a7xV5KAAAAAJ:UeHWp8X0CEIC" target="_blank" rel="noopener noreferrer" className="pub__link">
                    <div className="pub__title">
                      Non-parametric Estimation for Stochastic Differential Equation
                      perturbed by L&eacute;vy Noise
                    </div>
                  </a>
                  <div className="pub__year">2024</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="section contact" id="contact" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Get in Touch</div>
            <div className="section__title">Contact</div>
            <div className="section__desc">
              Interested in collaboration, research discussion, or academic
              inquiries? Feel free to reach out.
            </div>
            <form className="contact__form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="contact__input"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                className="contact__input"
                placeholder="Your Email"
                required
              />
              <textarea
                className="contact__textarea"
                placeholder="Your Message"
                required
              />
              <button type="submit" className="btn btn--primary contact__submit">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer" data-scroll-section>
          <div className="footer__particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="footer__particle"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.animDelay,
                }}
              />
            ))}
          </div>
          <ul className="footer__links">
            <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a></li>
            <li><a href="#research" onClick={(e) => handleNavClick(e, "#research")}>Research</a></li>
            <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Publications</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a></li>
          </ul>
          <div className="footer__icons">
            <a
              href="mailto:brijesh@example.com"
              className="footer__icon"
              aria-label="Email"
            >
              {/* Email SVG icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            </a>
            <a
              href="https://scholar.google.com/citations?user=a7xV5KAAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="Google Scholar"
            >
              {/* Scholar SVG icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-3a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM1 10L12 2l11 8H1z" />
              </svg>
            </a>
          </div>
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Dr. Brijesh Kumar Jha. All rights
            reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
