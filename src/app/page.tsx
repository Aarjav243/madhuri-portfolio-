"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { SiGooglescholar, SiResearchgate } from "react-icons/si";

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

    initLocomotive();
    initAnimations();
    
    // Ensure content is visible immediately since preloader is removed
    gsap.set(".main-content", { opacity: 1 });

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

      /* --- Hero text Typewriter --- */
      const heroTitle = document.querySelector(".hero__title") as HTMLElement;
      if (heroTitle) {
        const fullText = "Dr. Madhuri Saripalle";
        heroTitle.innerHTML = "";
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < fullText.length) {
            heroTitle.innerHTML += fullText.charAt(i);
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 100);
      }

      

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

      /* --- About section (Staggered Slide-in) --- */
      gsap.to(".about__bio > *, .about__list li", {
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
      });

      gsap.from(".about__photo-wrap", {
        scrollTrigger: {
          trigger: ".about",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      /* --- Education: Supply Chain Trade-Route Network --- */
      const timelinePath = document.querySelector(".timeline-path") as SVGPathElement;
      if (timelinePath) {
        const pathLength = timelinePath.getTotalLength();
        gsap.set(timelinePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 1 });
        gsap.to(timelinePath, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: ".education__timeline",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 1.2,
          },
          ease: "none",
        });
      }

      (gsap.utils.toArray(".education__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          onEnter: () => {
            item.classList.add("is-visible");
            // Node pop-in
            gsap.to(item.querySelector(".education__card"), {
              opacity: 1,
              x: 0,
              duration: 0.7,
              delay: 0.1,
              ease: "back.out(1.4)",
            });
          },
          onLeaveBack: () => item.classList.remove("is-visible"),
        });
      });

      /* --- Experience: Card Fade-In --- */
      const experienceCards = gsap.utils.toArray(".teaching__card") as HTMLElement[];
      experienceCards.forEach((card: HTMLElement, i: number) => {
        gsap.set(card, { y: 30, opacity: 0 });
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      (gsap.utils.toArray(".research__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          ease: "back.out(1.7)",
        });
      });

      /* --- Research projects slide up --- */
      (gsap.utils.toArray(".project__card") as HTMLElement[]).forEach((card: HTMLElement, i: number) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      });

      /* --- Publications: Supply Node Pulse --- */

      (gsap.utils.toArray(".pub__category") as HTMLElement[]).forEach((cat: HTMLElement) => {
        gsap.set(cat, { opacity: 0, y: 10 });
        gsap.to(cat, {
          scrollTrigger: { trigger: cat, start: "top 90%" },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out"
        });
      });

      (gsap.utils.toArray(".pub__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        const nodeIndicator = item.querySelector(".pub__node-indicator") as HTMLElement;
        gsap.set(item, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: item,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(item, { opacity: 1, y: 0, duration: 0.6, delay: (i % 6) * 0.08, ease: "power3.out" });
            if (nodeIndicator) {
              gsap.timeline({ delay: (i % 6) * 0.08 + 0.15 })
                .fromTo(nodeIndicator,
                  { opacity: 0, scale: 0 },
                  { opacity: 1, scale: 1.5, duration: 0.25, ease: "power2.out" }
                )
                .to(nodeIndicator, { scale: 1, duration: 0.35, ease: "elastic.out(1.2, 0.5)" });
            }
          }
        });
      });

      /* --- Conference: City Node Network Animation --- */
      const conferenceTimelinePath = document.querySelector(".conference__timeline-path") as SVGPathElement;
      if (conferenceTimelinePath) {
        const pathLength = conferenceTimelinePath.getTotalLength();
        gsap.set(conferenceTimelinePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength, opacity: 0.3 });
        gsap.to(conferenceTimelinePath, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: "#conferences",
            start: "top 70%",
            end: "bottom 60%",
            scrub: 1.5,
          },
          ease: "none",
        });
      }

      (gsap.utils.toArray(".conf__item") as HTMLElement[]).forEach((item: HTMLElement, i: number) => {
        const dot = item.querySelector(".conf-node-dot") as SVGCircleElement;
        gsap.to(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            onEnter: () => {
              // Slide in the card
              gsap.to(item, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.08, ease: "power3.out" });
              // Pop the city node dot
              if (dot) {
                gsap.timeline({ delay: i * 0.08 })
                  .to(dot, { opacity: 1, attr: { r: 8 }, duration: 0.3, ease: "back.out(2)" })
                  .to(dot, { attr: { r: 6 }, duration: 0.2, ease: "power2.inOut" })
                  // Signal pulse ripple
                  .to(dot, {
                    attr: { r: 14 },
                    opacity: 0,
                    duration: 0.7,
                    ease: "power1.out",
                  }, "-=0.1");
              }
            }
          },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dr. Madhuri Saripalle",
    "jobTitle": "Professor of Economics",
    "affiliation": {
      "@type": "CollegeOrUniversity",
      "name": "IFMR Graduate School of Business, Krea University"
    },
    "url": "https://madhuri-portfolio-chi.vercel.app/",
    "image": "https://madhuri-portfolio-chi.vercel.app/madhuri_photo.jpg",
    "sameAs": [
      "https://krea.edu.in/ifmrgsb/prof-madhuri-saripalle/",
      "https://scholar.google.com/citations?user=O0kzVucAAAAJ&hl=en",
      "https://www.researchgate.net/profile/Madhuri-Saripalle-2"
    ],
    "description": "Professor at IFMR GSB, Krea University, specializing in Industrial Organization, Agri-business, and Supply Chain Management."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      {/* ============================
          NAVIGATION
          ============================ */}
      <nav className="nav">
        <div className="nav__logo">
          Dr<span>.</span> Madhuri Saripalle
        </div>
        <ul className="nav__links">
          <li><a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a></li>
          <li><a href="#education" onClick={(e) => handleNavClick(e, "#education")}>Education</a></li>
          <li><a href="#teaching" onClick={(e) => handleNavClick(e, "#teaching")}>Experience</a></li>
          <li><a href="#projects" onClick={(e) => handleNavClick(e, "#projects")}>Projects</a></li>
          <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Research</a></li>
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
        <a href="#teaching" onClick={(e) => handleNavClick(e, "#teaching")}>Experience</a>
        <a href="#projects" onClick={(e) => handleNavClick(e, "#projects")}>Projects</a>
        <a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Research</a>
        <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a>
      </div>

      {/* ============================
          MAIN CONTENT
          ============================ */}
      <main
        className="main-content"
        ref={scrollContainerRef}
        data-scroll-container
      >
        {/* ── HERO ── */}
        <section className="hero" id="hero" data-scroll-section>
          
          <div className="hero__overlay" />
          <div className="glow-orb glow-orb--1" />
          <div className="glow-orb glow-orb--2" />
          <div className="glow-orb glow-orb--3" />
          <div className="hero__content">
            <h1 className="hero__title">Dr. Madhuri Saripalle</h1>
            <p className="hero__subtitle">
              Professor | PhD in Agricultural Economics | Applied Economics
            </p>
            <div className="hero__ctas">
              <a href="#publications" className="btn btn--primary" onClick={(e) => handleNavClick(e, "#publications")}>
                View Research
              </a>
              <a href="#contact" className="btn btn--outline" onClick={(e) => handleNavClick(e, "#contact")}>
                Contact
              </a>
              <a
                href="mailto:madhuri.saripalle@krea.edu.in"
                className="btn btn--icon btn--outline magnetic"
                title="Email Me"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://krea.edu.in/ifmrgsb/prof-madhuri-saripalle/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--icon btn--outline magnetic"
                title="Krea Profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://scholar.google.com/citations?user=O0kzVucAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--icon btn--outline magnetic"
                title="Google Scholar"
              >
                <SiGooglescholar size={20} />
              </a>
              <a
                href="https://www.researchgate.net/profile/Madhuri-Saripalle-2"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--icon btn--outline magnetic"
                title="ResearchGate"
              >
                <SiResearchgate size={20} />
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
                  src="/madhuri_photo.jpg"
                  alt="Dr. Madhuri Saripalle"
                  width={400}
                  height={400}
                  className="about__photo"
                  priority
                />
              </div>
              <div className="about__bio">
                <h3>Academic &amp; Research Profile</h3>
                <p>
                  Dr. Madhuri Saripalle is a Professor at IFMR Graduate School of Business, Krea University. She holds a <strong>PhD in Agricultural Economics</strong> from the University of Connecticut, USA.
                </p>
                <p>
                  Her research focuses on <strong>Industrial Organization, Technology & Productivity, Agri-business, and Supply Chain Management</strong>. She has extensive experience in both academia and industry, having worked with organizations like the Murugappa Group and TVS Supply Chain Solutions.
                </p>
                <p>
                  She has delivered lectures internationally, including as a Visiting Faculty at the University of Catania, Italy, where she spoke on urban mobility and agribusiness supply chains.
                </p>
                <ul className="about__list">
                  <li>Industrial Organization | Technology & Productivity</li>
                  <li>Agri-business | Supply Chain Management</li>
                  <li>Professor, IFMR GSB, Krea University</li>
                  <li>PhD Chairperson (2018-19) & MBA Chairperson (2024-26)</li>
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
              {/* Supply Chain Network SVG — trade routes draw on scroll */}
              <div className="timeline-svg-container">
                <svg width="100%" height="100%" viewBox="0 0 100 800" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="timeline-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#2563eb" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  {/* Ghost path — decorative supply chain grid */}
                  <path
                    d="M50,0 C50,80 10,80 10,160 S50,240 50,320 S90,400 90,480 S50,560 50,640 V800"
                    fill="none"
                    stroke="rgba(37,99,235,0.07)"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  {/* Animated trade route path */}
                  <path
                    className="timeline-path"
                    d="M50,0 L50,140 L10,200 L90,280 L10,360 L50,440 L50,640 L50,800"
                    fill="none"
                    stroke="url(#timeline-grad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    Ph.D., Agricultural Economics
                  </div>
                  <div className="education__institution">
                    University of Connecticut
                  </div>
                  <div className="education__location">Storrs, CT, USA</div>
                </div>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    M.Phil., Applied Economics
                  </div>
                  <div className="education__institution">
                    Center for Development Studies, JNU
                  </div>
                  <div className="education__location">Trivandrum, India</div>
                </div>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    M.A., Economics
                  </div>
                  <div className="education__institution">
                    Hyderabad Central University
                  </div>
                  <div className="education__location">Hyderabad, India</div>
                </div>
              </div>

              <div className="education__item">
                <div className="education__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="education__degree">
                    B.A. (Hons), Economics
                  </div>
                  <div className="education__institution">
                    Miranda House, Delhi University
                  </div>
                  <div className="education__location">Delhi, India</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="teaching" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Experience</div>
            <div className="section__title">Academic Experience</div>
            <div className="teaching__timeline">
              <div className="teaching__grid">
              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="exp__node-indicator" />
                <div className="teaching__role">Professor</div>
                <div className="teaching__institution">
                  IFMR Graduate School of Business, Krea University
                </div>
                <div className="teaching__duration">
                  Nov 2022 – Present
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="exp__node-indicator" />
                <div className="teaching__role">Associate Professor</div>
                <div className="teaching__institution">
                  IFMR Graduate School of Business, Krea University
                </div>
                <div className="teaching__duration">
                  June 2017 – Oct 2022
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="exp__node-indicator" />
                <div className="teaching__role">Assistant Professor</div>
                <div className="teaching__institution">
                  Madras School of Economics, Chennai
                </div>
                <div className="teaching__duration">
                  Aug 2011 – May 2017
                </div>
              </div>

              <div className="teaching__card glass-card">
                <div className="glimmer-overlay" />
                <div className="exp__node-indicator" />
                <div className="teaching__role">Assistant Professor</div>
                <div className="teaching__institution">
                  Maine Maritime Academy, USA
                </div>
                <div className="teaching__duration">
                  2005 – 2006
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ADMINISTRATIVE ── */}
        <section className="section" id="admin" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Leadership</div>
            <div className="section__title">Administrative Positions</div>
            <div className="projects__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>MBA Chairperson</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)' }}>2024–26</div>
              </div>
              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>PhD Chairperson</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)' }}>2018–19</div>
              </div>
              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Area Chair, Economics</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)' }}>2016–18</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TEACHING ── */}
        <section className="section" id="teaching-portfolio" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Expertise</div>
            <div className="section__title">Teaching Portfolio</div>
            <div className="research__grid">
              {[
                "Microeconomics I & II", "Managerial Economics", "Industrial Organization", 
                "Game Theory", "Development Economics", "Business Applications in Game Theory"
              ].map((course) => (
                <div className="research__item glass-card" key={course}>
                  <div className="glimmer-overlay" />
                  <div className="research__name" style={{ textAlign: 'center' }}>{course}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INDUSTRY ── */}
        <section className="section" id="industry" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Professional</div>
            <div className="section__title">Industry Experience</div>
            <div className="teaching__timeline">
              <div className="teaching__grid">
                <div className="teaching__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="exp__node-indicator" />
                  <div className="teaching__role">Assistant General Manager</div>
                  <div className="teaching__institution">Knowledge Management, TVS Supply Chain Solutions, Chennai</div>
                </div>
                <div className="teaching__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="exp__node-indicator" />
                  <div className="teaching__role">Economist</div>
                  <div className="teaching__institution">Murugappa Group, Chennai</div>
                </div>
                <div className="teaching__card glass-card">
                  <div className="glimmer-overlay" />
                  <div className="exp__node-indicator" />
                  <div className="teaching__role">Senior Economist</div>
                  <div className="teaching__institution">Nathan Economic Consulting, Chennai</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="research" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Interests</div>
            <div className="section__title">Research Interests</div>
            <div className="research__grid">
              {[
                { icon: "🏭", name: "Industrial Organization" },
                { icon: "📊", name: "Technology & Productivity" },
                { icon: "🚜", name: "Agri-business" },
                { icon: "📦", name: "Supply Chain Management" },
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

        {/* ── PROJECTS ── */}
        <section className="section" id="projects" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Work</div>
            <div className="section__title">Research Projects</div>
            <div className="projects__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Analysing rice price volatility across interrelated markets in India</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Funded by IFMR Fund for Research in Humanities and Social Sciences</p>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Needs Assessment Analysis: Village clusters in Tamil Nadu</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Funded by Sri A.M.M. Murugappa Chettiar Research Center (MCRC), Chennai, Tamil Nadu</p>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Manufacturing Matters: Employment-oriented industrialisation</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>With Ford Foundation and IGIDR</p>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Fiscal Instruments for Climate-Friendly Industrial Development</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Collaboration with Madras School of Economics and CII</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)' }}>2011–12</div>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Technology Solutions Impact Analysis</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Third-party validation for Core Support Program initiatives, Sri A.M.M. Murugappa Chettiar Research Center (MCRC), Chennai</p>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Impact analysis of Rural Greening Program-Third Party validation</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Funded by Sri AMM Murugappa Chettiar Research Centre (MCRC), Chennai, Tamil Nadu</p>
              </div>

              <div className="project__card glass-card" style={{ padding: '2rem' }}>
                <div className="glimmer-overlay" />
                <h4 className="project__title" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Labour practices in India</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>In collaboration with the Institute for Human Development Studies (IHDS) and the International Labour Organisation (ILO)</p>
              </div>
            </div>           </div>         </section>

        {/* ── CONFERENCES ── */}
        <section className="section" id="conferences" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Global Presence</div>
            <div className="section__title">Conference Presentations</div>
            <div className="education__timeline" style={{ position: 'relative', paddingLeft: '3rem' }}>
              <div className="timeline-svg-container">
                <svg width="100%" height="100%" viewBox="0 0 100 600" preserveAspectRatio="none">
                  <path
                    className="conference__timeline-path"
                    d="M50,0 C50,100 10,100 10,200 S90,300 90,400 S50,500 50,600"
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    opacity="0.3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <div className="conference__network-wrap">
                {/* Conference city-node network list */}
                {[
                  {
                    title: "Electric Vehicle Penetration and Smart Mobility Solutions in Urban India",
                    venue: "Conference on Mobility and Transport Solutions for Societal Challenges, Venice School of Management (VSM) & Center for Automotive and Mobility Innovation (CAMI)",
                    location: "🇮🇹 Venice, Italy",
                    date: "Oct 2026"
                  },
                  {
                    title: "Agriculture transformation in Telangana: case study of Paddy cultivation",
                    venue: "International Conference on Enabling Sustained Growth in Emerging Asia, University of Hyderabad, School of Economics",
                    location: "🇮🇳 Hyderabad, India",
                    date: "Feb 2025"
                  },
                  {
                    title: "Analyzing Interstate Price Volatility in the Rice Supply Chain",
                    venue: "AAEA Annual Conference",
                    location: "🇺🇸 USA",
                    date: "2024"
                  },
                  {
                    title: "Testing and Risk Attitude under Incomplete Information: game theoretic perspective",
                    venue: "AEA Annual Meeting",
                    location: "🇺🇸 San Antonio, USA",
                    date: "2024"
                  },
                  {
                    title: "Panel discussant on 'Sectoral Firms'",
                    venue: "Workshop on Industrial Policy in Indian States, organised by MIDS in collaboration with NPEI, IIT Mumbai",
                    location: "🇮🇳 India",
                    date: "Mar 2024"
                  },
                  {
                    title: "Small Farmer Production Choices During COVID-19",
                    venue: "WINIR Conference",
                    location: "🇮🇹 Italy",
                    date: "2023"
                  },
                  {
                    title: "Production, Prices and Supply Chain disruption: Evidence from farmers in South India",
                    venue: "AAEA Annual Conference",
                    location: "🇺🇸 USA",
                    date: "2022"
                  },
                  {
                    title: "Trade and R&D Impact on Productivity",
                    venue: "CAED Conference, University of Michigan",
                    location: "🇺🇸 USA",
                    date: "2019"
                  },
                  {
                    title: "Industrialisation for Jobs and Growth",
                    venue: "Dissemination Workshop, organised by Ministry of Skill Development and Entrepreneurship & IGIDR, New Delhi",
                    location: "🇮🇳 New Delhi, India",
                    date: "Oct 2019"
                  }
                ].map((conf, idx) => (
                  <div className="conf__item" key={conf.title} style={{ marginBottom: '1.2rem', position: 'relative' }}>
                    {/* City node SVG dot */}
                    <svg className="conference__network-svg" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                      {/* Vertical connector line */}
                      {idx > 0 && <line x1="20" y1="0" x2="20" y2="24" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />}
                      {/* City dot */}
                      <circle className="conf-node-dot" cx="20" cy="30" r="6" />
                      {/* Connector below */}
                      <line x1="20" y1="36" x2="20" y2="60" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
                    </svg>
                    <div className="pub__item glass-card" style={{ padding: '1.5rem', marginLeft: '0.5rem' }}>
                      <div className="glimmer-overlay" />
                      <div className="conf__location-badge">📍 {conf.location}</div>
                      <div className="pub__title" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{conf.title}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{conf.venue}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--accent-orange)', marginTop: '0.5rem' }}>{conf.date}</div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

        <section className="section" id="publications" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Research</div>
            <div className="section__title">Selected Publications</div>
            <div className="publications__list-wrapper">
              <div className="publications__list">
                <div className="pub__category">Peer-Reviewed Journals</div>

                {[
  {
    "title": "Determinants of profitability in the Indian logistics industry",
    "authors": "M Saripalle",
    "journal": "International Journal of Logistics Economics and Globalisation 7 (1), 13-27",
    "year": "2018",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:_FxGoFyzp5QC"
  },
  {
    "title": "Jasmine cultivation in Tamil Nadu: Market structure and pricing",
    "authors": "M Saripalle",
    "journal": "World Development Perspectives 1, 12-14",
    "year": "2016",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:WF5omc3nYNoC"
  },
  {
    "title": "Market awareness and profitability: case study of mango production in Karnataka, India",
    "authors": "M Saripalle",
    "journal": "",
    "year": "2019",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:Se3iqnhoufwC"
  },
  {
    "title": "Labour practices in India",
    "authors": "D Nathan, M Saripalle, L Gurunathan",
    "journal": "ILO Working Papers",
    "year": "2016",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:5nxA0vEk-isC"
  },
  {
    "title": "Learning across policy regimes: a case study of the Indian automobile industry",
    "authors": "M Saripalle",
    "journal": "International journal of automotive technology and management 12 (2), 197-217",
    "year": "2012",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:zYLM7Y9cAGgC"
  },
  {
    "title": "The Indian Auto Component Industry: Competing through Costs or Capabilities",
    "authors": "M Saripalle",
    "journal": "IIMB Management Review 20 (4), 358-373",
    "year": "2008",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:LkGwnXOMwfcC"
  },
  {
    "title": "Tamil Nadu's Electronics Industry: Lessons for'Make in India'",
    "authors": "M Saripalle",
    "journal": "Economic and Political Weekly, 99-103",
    "year": "2015",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:Y0pCki6q_DkC"
  },
  {
    "title": "Learning and capability acquisition: A case study of the Indian automobile industry",
    "authors": "M Saripalle",
    "journal": "Madras School of Economics",
    "year": "2012",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:d1gkVwhDpl0C"
  },
  {
    "title": "The determinants of firm’s growth in the telecommunication services industry: Empirical evidence from India",
    "authors": "S Somya, M Saripalle",
    "journal": "Journal of Quantitative Economics 21 (1), 193-211",
    "year": "2023",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:3fE2CSJIrl8C"
  },
  {
    "title": "Integration into Global Automotive Value Chains: Co-Evolution of Firm and Market Capabilities",
    "authors": "M Saripalle",
    "journal": "International Trade and Industrial Development in India: Emerging Trends&nbsp;…",
    "year": "2016",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:ufrVoPGSRksC"
  },
  {
    "title": "Learning across policy regimes: The impact of protection vis-à-vis competition in the Indian automotive industry",
    "authors": "M Saripalle",
    "journal": "University of Connecticut",
    "year": "2006",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:u5HHmVD_uO8C"
  },
  {
    "title": "Driving productivity: a comparison of the Indian automobile manufacturers and component suppliers",
    "authors": "M Saripalle, P Gupta",
    "journal": "Asian Journal of Technology Innovation 33 (3), 1106-1136",
    "year": "2025",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:qxL8FJ1GzNcC"
  },
  {
    "title": "Production, prices and supply chain disruption among farmers during Covid-19: empirical evidence from India",
    "authors": "M Saripalle, VC Subramanian",
    "journal": "",
    "year": "2022",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:M3ejUd6NZC8C"
  },
  {
    "title": "Fiscal instruments for climate friendly industrial development in tamil nadu",
    "authors": "DK Srivastava, KR Shanmugam, KSK Kumar, M Saripalle",
    "journal": "Report",
    "year": "2014",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:YsMSGLbcyi4C"
  },
  {
    "title": "Export Competitiveness in the Indian auto-component industry: Does Low Wage Cost matter?",
    "authors": "M Saripalle",
    "journal": "Madras School of Economics",
    "year": "2007",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:IjCSPb-OGe4C"
  },
  {
    "title": "Impact of COVID-19 on production decisions of marginal, small and medium farmers: empirical evidence from South India",
    "authors": "M Saripalle, V Chebolu-Subramanian",
    "journal": "Journal of Agribusiness in Developing and Emerging Economies 15 (6), 1081-1100",
    "year": "2025",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:4TOpqqG69KYC"
  },
  {
    "title": "Supplier relations in the Indian automotive industry: arms length to long-term commitment",
    "authors": "M Saripalle",
    "journal": "online] http://mpra. ub. uni-muenchen. de/1699/1/MPRA_paper_1699. pdf",
    "year": "2006",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:9yKSN-GCB0IC"
  },
  {
    "title": "Competing through low labour costs versus capabilities",
    "authors": "M Saripalle, B Line",
    "journal": "Business Line",
    "year": "2004",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:u-x6o8ySG0sC"
  },
  {
    "title": "Inter-firm relationship and governance structure: A study of Bhilai Steel Plant and its ancillaries",
    "authors": "M Saripalle",
    "journal": "Economic and Political Weekly, M106-M113",
    "year": "1999",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:UebtZRa9Y70C"
  },
  {
    "title": "Market Structure, Profitability and Regulation of Telecommunication Industry in India",
    "authors": "M Saripalle, S Somya",
    "journal": "Global Business Review, 09721509241232198",
    "year": "2024",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&citation_for_view=O0kzVucAAAAJ:_kc_bZDykSQC"
  },
  {
    "title": "Determinants of Employment in the Indian Automobile Industry",
    "authors": "M Saripalle",
    "journal": "Industrialisation for Employment and Growth in India: Lessons from Small&nbsp;…",
    "year": "2021",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:kNdYIx-mwKoC"
  },
  {
    "title": "Simultaneity between Mobile Penetration and Economic Growth: A Panel data analysis of Indian States",
    "authors": "S Somya, M Saripalle",
    "journal": "",
    "year": "2021",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:Zph67rFs4hoC"
  },
  {
    "title": "Mango value chains in India",
    "authors": "M Saripalle, E Kannan",
    "journal": "Transforming Agriculture in South Asia, 211-231",
    "year": "2020",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:8k81kl-MbHgC"
  },
  {
    "title": "The Macro-economic impact of financial crisis on private R&D effort in Indian Manufacturing sector: a sectoral analysis",
    "authors": "M Saripalle",
    "journal": "",
    "year": "2019",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:hqOjcs7Dif8C"
  },
  {
    "title": "ILO Asia-Pacific Working Paper Series",
    "authors": "D Nathan, M Saripalle, L Gurunathan",
    "journal": "",
    "year": "2016",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:dhFuZR0502QC"
  },
  {
    "title": "R&D Spillovers Across the Supply Chain: Evidence from the Indian Automobile Industry",
    "authors": "M Saripalle",
    "journal": "Globalization of Indian Industries: Productivity, Exports and Investment, 43-70",
    "year": "2015",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:eQOLeE2rZwMC"
  },
  {
    "title": "Learning and capability acquisition: Growth of the Indian automobile industry",
    "authors": "M Saripalle",
    "journal": "University of Connecticut",
    "year": "2005",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:2osOgNQ5qMEC"
  },
  {
    "title": "The Economic Impact of Continuing Operations of the University of Connecticut Health Center (Second Report)",
    "authors": "M Saripalle, T Ray, S McMillen",
    "journal": "University of Connecticut, Connecticut Center for Economic Analysis",
    "year": "2002",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:9ZlFYXVOiuMC"
  },
  {
    "title": "Analysis of Alternatives to Incarceration in Connecticut",
    "authors": "F Carstensen, S McMillen, N Weerasinghe, A Bhattacharya, ...",
    "journal": "University of Connecticut, Connecticut Center for Economic Analysis",
    "year": "2001",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:Wp0gIr-vW9MC"
  },
  {
    "title": "PROMOTING TECHNOLOGIES FOR SUSTAINABLE AGRICULTURE: LESSONS FROM FARMERS IN SOUTH INDIA1",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:QIV2ME_5wuYC"
  },
  {
    "title": "Connecticut Prices Put on Their Best Behavior",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:mVmsd5A6BfQC"
  },
  {
    "title": "Transporation Prices on a Roll, but Housing Helps Keep Overall Prices in Check",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:4DMP91E08xMC"
  },
  {
    "title": "CCEA: Connecticut Prices: Medical Prices SURGE, but Weightier Food and Housing Prices Are More Stable",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:aqlVkmm33-oC"
  },
  {
    "title": "R&D Spillovers Across the Supply Chain: Evidence from the Indian Automobile",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:KlAtU1dfN6UC"
  },
  {
    "title": "R&D spillovers across the supply chain",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:W7OEmFMy1HYC"
  },
  {
    "title": "Labor productivity, trade and R&D in the Electronics industry",
    "authors": "M Saripalle",
    "journal": "",
    "year": "",
    "url": "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=O0kzVucAAAAJ&cstart=20&pagesize=80&citation_for_view=O0kzVucAAAAJ:Tyk-4Ss8FVUC"
  }
].map((pub) => (
                  <div className="pub__item glass-card" key={pub.title} style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                    <div className="glimmer-overlay" />
                    <div className="pub__node-indicator" />
                    <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div className="pub__title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-orange)'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>
                        {pub.title}
                      </div>
                    </a>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{pub.authors}{pub.year ? ` (${pub.year})` : ''}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', fontStyle: 'italic' }}>{pub.journal}</div>
                  </div>
                ))}

                <div className="pub__category" style={{ marginTop: '2rem' }}>Book Chapters</div>
                {[
                  {
                    title: "Mango Value Chain in India",
                    book: "Transforming Agriculture in South Asia. Routledge",
                    year: "2020",
                    authors: "Saripalle, M., & Kannan, E."
                  },
                  {
                    title: "Organization of Work in E-Supply Chains",
                    book: "State Capital Nexus: Implications for Labour. Hyderabad, India",
                    year: "2020",
                    authors: "Saripalle, M., & Chebolu-Subramanyan, Vijaya"
                  },
                  {
                    title: "Determinants of Employment in the Indian Automobile Industry",
                    book: "Industrialisation for Employment and Growth in India. Cambridge University Press",
                    year: "2021",
                    authors: "Saripalle, M."
                  },
                  {
                    title: "Integration into global automotive value chains: co-evolution of firm and market capabilities",
                    book: "International Trade and Industrial Development in India: Emerging Trends, Patterns and Issues, Orient Blackswan, New Delhi",
                    year: "2016",
                    authors: "Saripalle, M."
                  },
                  {
                    title: "Labour Practices in India",
                    book: "ILO Asia- Pacific Working Paper Series, ISSN: 2227-4391",
                    year: "2016",
                    authors: "Saripalle, M., Dev Nathan, & L Gurunathan"
                  },
                  {
                    title: "R&D spillovers across the supply chain: Evidence from the Indian automobile industry",
                    book: "Globalization of Indian Industries: productivity, exports and investments, Springer",
                    year: "2016",
                    authors: "Saripalle, M."
                  }
                ].map((chapter) => (
                  <div className="pub__item glass-card" key={chapter.title} style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                    <div className="glimmer-overlay" />
                    <div className="pub__node-indicator" />
                    <div className="pub__title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{chapter.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{chapter.authors} ({chapter.year})</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', fontStyle: 'italic' }}>{chapter.book}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        {/* ── WORKING PAPERS ── */}
        <section className="section" id="working-papers" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Forthcoming</div>
            <div className="section__title">Working Papers / Monographs</div>
            <div className="publications__list">
              {[
                { title: "Economic Analysis of Organic Inputs and Bio Stimulants: Adoption and Crop Yield in South India", venue: "Under review, Sustainable Futures" },
                { title: "Agricultural Transformation and Paddy production: Case study of Telangana", venue: "" },
                { title: "Decision making in the pandemic under incomplete information: a game theory perspective", venue: "With Vijaya C. Subramanian" },
                { title: "Mobile penetration, inequality and economic growth", venue: "With Jyoti Prasad Mukhopadhyay and Surabhi Somya" },
                { title: "Fiscal instruments for climate-friendly industrial development", venue: "Monograph 28/2014, Madras School of Economics, March 2014" }
              ].map((paper) => (
                <div className="pub__item glass-card" key={paper.title} style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                  <div className="glimmer-overlay" />
                  <div className="pub__node-indicator" />
                  <div className="pub__title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{paper.title}</div>
                  {paper.venue && <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', fontStyle: 'italic' }}>{paper.venue}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
    
        {/* ── SELECTED ARTICLES ── */}
        <section className="section" id="articles" data-scroll-section>
          <div className="section__container">
            <div className="section__label">Opinion & News</div>
            <div className="section__title">Selected Articles</div>
            <div className="publications__list">
              {[
                { 
                  title: "Looking into our Export Basket", 
                  outlet: "Hindu Business Line", 
                  date: "Oct 2024",
                  url: "https://www.thehindubusinessline.com/opinion/looking-into-our-export-basket/article68765905.ece"
                },
                { 
                  title: "Cracking the Indian Auto Market", 
                  outlet: "Hindu Business Line", 
                  date: "Sept 2021",
                  url: "https://www.thehindubusinessline.com/opinion/cracking-the-indian-auto-market-why-ford-lost-and-hyundai-won/article36554159.ece"
                },
                { 
                  title: "End Brinkmanship on Farm Laws", 
                  outlet: "Mint", 
                  date: "Feb 2021",
                  url: "https://www.livemint.com/opinion/online-views/end-brinkmanship-and-go-for-a-win-win-on-farm-laws-11614184329199.html"
                },
                { 
                  title: "Start with local languages for the ease of starting business", 
                  outlet: "Mint", 
                  date: "Feb 2020",
                  url: "https://www.livemint.com/opinion/columns/start-with-local-languages-for-the-ease-of-starting-a-business-11581962582497.html"
                },
                { 
                  title: "GST impact on the Logistics sector", 
                  outlet: "Mint", 
                  date: "August 8, 2017",
                  url: "https://www.livemint.com/Opinion/NbSCQ2KGNEcTGf1PA7IxcM/GST-impact-on-the-logistics-sector.html"
                }
              ].map((article) => (
                <div className="pub__item glass-card" key={article.title} style={{ padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                  <div className="glimmer-overlay" />
                  <div className="pub__node-indicator" />
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="pub__title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-orange)'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>
                      {article.title}
                    </div>
                  </a>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{article.outlet} | {article.date}</div>
                </div>
              ))}
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
            <li><a href="#projects" onClick={(e) => handleNavClick(e, "#projects")}>Projects</a></li>
            <li><a href="#publications" onClick={(e) => handleNavClick(e, "#publications")}>Research</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a></li>
          </ul>
          <div className="footer__icons">
            <a
              href="mailto:madhuri.saripalle@krea.edu.in"
              className="footer__icon"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://krea.edu.in/ifmrgsb/prof-madhuri-saripalle/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="Krea Profile"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://scholar.google.com/citations?user=O0kzVucAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="Google Scholar"
            >
              <SiGooglescholar size={18} />
            </a>
            <a
              href="https://www.researchgate.net/profile/Madhuri-Saripalle-2"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__icon"
              aria-label="ResearchGate"
            >
              <SiResearchgate size={18} />
            </a>
          </div>
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Dr. Madhuri Saripalle. All rights
            reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
