"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Hand,
  Menu,
  Music2,
  Pause,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import AccordionGallery from "../AccordionGallery";
import ImageTrail from "../ImageTrail";
import image_001 from "../../public/image-002.jpg";
import image_006 from "../../public/image-006.jpg"
import image_013 from "../../public/image-013.jpg"

const accordionItems = [
  { image: "/image-016.jpg",  },
  { image: "/image-003.jpg",  },
  { image: "/image-004.jpg",  },
  { image: "/image-005.jpg",  },
  { image: "/image-014.jpg",  },
  { image: "/image-006.jpg",  },
  { image: "/image-007.jpg",  },
  { image: "/image-008.jpg",  },
  { image: "/image-009.jpg",  },
  { image: "/image-010.jpg",  },
  { image: "/image-011.jpg",  },
  { image: "/image-012.jpg",  },
];

const wedding = {
  bride: "Nebiyu",
  groom: "Hewan",
  date: "2026-10-05T10:00:00",
  displayDate: "05 · 10 · 2026",
  venue: "The Garden House",
  location: "Addis Ababa, Ethiopia",
  music: "/music/wedding.mp3",
};

const photos = [
  {
    src: image_001,
    alt: "Couple walking through a field",
    line: "It started with a hello.",
  },
  {
    src: image_013,
    alt: "Couple sharing a quiet moment",
    line: "Then came a thousand little moments.",
  },
  {
    src: image_001,
    alt: "Wedding couple celebrating",
    line: "Somewhere along the way, forever became the plan.",
  },
  {
    src: image_006,
    alt: "Bride and groom together",
    line: "And somehow, every road led here.",
  },
];

function useCountdown() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(wedding.date).getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

function CurtainIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const left = useTransform(scrollYProgress, [0, 1], ["0%", "-102%"]);
  const right = useTransform(scrollYProgress, [0, 1], ["0%", "102%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0]);
  return (
    <section ref={ref} className="curtain-section">
      <motion.div className="curtain curtain-left" style={{ x: left }} />
      <motion.div className="curtain curtain-right" style={{ x: right }} />
      <motion.div style={{ opacity }} className="curtain-copy">
        <span className="eyebrow">The wedding of</span>
        <h1>
          <em>{t.hero.name1}</em>
          <span>&</span>
          <em>{t.hero.name2}</em>
        </h1>
        <p className="curtain-date">{t.date.displayDate}</p>
        <div className="scroll-cue">
          <span>Scroll to enter</span>
          <ChevronDown />
        </div>
      </motion.div>
    </section>
  );
}

function ScratchCard() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const scratched = useRef(0);
  useEffect(() => {
    if (revealed) return; // Don't redraw if already scratched off
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#c6a66b");
    gradient.addColorStop(0.48, "#f1dfad");
    gradient.addColorStop(1, "#a7864f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.18)";
    for (let i = 0; i < 60; i++) {
      ctx.fillRect(
        Math.random() * rect.width,
        Math.random() * rect.height,
        1,
        1,
      );
    }
    ctx.fillStyle = "#473927";
    ctx.textAlign = "center";
    ctx.font = "500 11px Arial";
    ctx.letterSpacing = "3px";
    ctx.fillText(t.dateSection.scratchText, rect.width / 2, rect.height / 2);
  }, [t.dateSection.scratchText, revealed]);
  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const r = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 24, 0, Math.PI * 2);
    ctx.fill();
    scratched.current += 1;
    if (scratched.current > 28) {
      setRevealed(true);
      ctx.clearRect(0, 0, r.width, r.height);
    }
  };
  return (
    <div className={`scratch-card ${revealed ? "revealed" : ""}`}>
      <div className="date-under">
        <span>{t.date.day}</span><small>{t.date.month}</small><span>{t.date.year}</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="Scratch to reveal the wedding date"
        onPointerDown={() => {
          drawing.current = true;
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
        onPointerLeave={() => {
          drawing.current = false;
        }}
        onPointerMove={scratch}
      />
    </div>
  );
}

function Countdown() {
  const time = useCountdown();
  const { t } = useLanguage();
  return (
    <div className="countdown">
      {Object.entries(time).map(([key, value]) => (
        <div key={key}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{t.dateSection.countdown[key as keyof typeof t.dateSection.countdown]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Invitation({ guestName }: { guestName?: string }) {
  const { t } = useLanguage();
  const [musicOn, setMusicOn] = useState(false);
  const [menu, setMenu] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [300, 1100], [1, 1.12]);
  useEffect(() => {
    if (audio.current) {
      audio.current.play().then(() => {
        setMusicOn(true);
      }).catch(() => {
        // Autoplay might be blocked by browser if interaction didn't register properly
        setMusicOn(false);
      });
    }
  }, []);

  const toggleMusic = () => {
    if (!audio.current) return;
    if (musicOn) {
      audio.current.pause();
    } else {
      audio.current.play().catch(() => {});
    }
    setMusicOn(!musicOn);
  };
  return (
    <main className="invitation">
      <audio ref={audio} src={wedding.music} loop />
      <nav
        className={`floating-nav ${menu ? "open" : ""}`}
        aria-label="Invitation navigation"
      >
        <button
          className="menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
        <div className="nav-links">
          <a href="#date" onClick={() => setMenu(false)}>
            The date
          </a>
          <a href="#story" onClick={() => setMenu(false)}>
            Our story
          </a>
          <a href="#gallery" onClick={() => setMenu(false)}>
            Gallery
          </a>
          <a href="#day" onClick={() => setMenu(false)}>
            Program
          </a>
          <a href="#venue" onClick={() => setMenu(false)}>
            Venue
          </a>
        </div>
      </nav>
      <button
        className={`music-control ${musicOn ? "playing" : ""}`}
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause music" : "Play music"}
      >
        {musicOn ? <Pause /> : <Music2 />}
        <span>{musicOn ? "Now playing" : "Play our song"}</span>
      </button>

      <section className="hero bg-[#170607] !flex !flex-col !justify-end !pb-[8vh]">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={photos[1].src}
            alt={photos[0].alt}
            fill
            quality={100}
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="hero-wash absolute inset-0 bg-gradient-to-t from-[#170607] from-[5%] via-[#170607]/80 via-[30%] to-transparent opacity-90" />
        <div className="hero-copy flex flex-col items-center relative z-10 w-full px-4 mb-[-5vh]">
          <span className="eyebrow text-[#D8B96A] tracking-[0.2em] uppercase text-[10px] mb-2">{t.hero.theWeddingOf}</span>
          
          {/* Names horizontally aligned to save vertical space */}
          <h1 className="flex flex-row flex-wrap justify-center items-center gap-3 md:gap-5 mb-4 text-[#FBF7EF]">
            <em className="font-serif italic font-light text-[clamp(3rem,7vw,5rem)] leading-none">{t.hero.name1}</em>
            <span className="font-serif italic text-2xl md:text-4xl text-[#D8B96A]">&amp;</span>
            <em className="font-serif italic font-light text-[clamp(3rem,7vw,5rem)] leading-none">{t.hero.name2}</em>
          </h1>
          
          <div className="hero-rule w-[30px] h-[1px] bg-[#D8B96A] mb-3" />
          
          <p className="font-serif text-[#FBF7EF]/90 text-[10px] tracking-[0.1em] uppercase mb-3">
            <span>{t.date.displayDate}</span>
          </p>
          
          <p className="font-serif italic text-[#D8B96A]/90 text-[clamp(0.85rem,1.5vw,1rem)] tracking-wide max-w-lg text-center mt-1 px-6">
            {t.hero.bibleVerse}
          </p>

          {/* Bouncing Scroll Down Arrow */}
          <motion.div
            className="mt-4 md:mt-6 text-[#D8B96A]"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={32} strokeWidth={2} />
          </motion.div>
        </div>
      </section>

      <section id="date" className="date-section section-pad">
        <div className="section-intro">
          <h2>
            {t.dateSection.title.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
          </h2>
          <p>
            {t.dateSection.subtitle}
          </p>
        </div>
        <ScratchCard />
        <div className="countdown-label">
          {t.dateSection.countdownLabel}
        </div>
        <Countdown />
      </section>

      <section id="story" className="story-section section-pad">
        <div className="story-heading">
          <h2>{t.nav.ourStory}</h2>
        </div>
        <div className="story-grid">
          <blockquote>
            {t.storySection.quote.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
          </blockquote>
          <div className="story-copy">
            <p>
            
              {t.storySection.p1.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}

            </p>
            <p>
              {t.storySection.p2}
            </p>
          </div>
          {/* <Image
            className="story-image"
            src={photos[1].src}
            alt={photos[1].alt}
            width={800}
            height={1066}
          /> */}
        </div>
      </section>

      <section id="gallery" className="accordion-section w-full bg-[#170607]">
        <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 w-full">
          <AccordionGallery
            items={accordionItems}
            defaultIndex={1}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#D8B96A"
            overlayColor="#170607"
            textColor="#FBF7EF"
            grayscale
            showLabels
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={800}
            gap={10}
            radius={16}
            orientation="horizontal"
          />
        </div>
      </section>

      <section id="day" className="timeline-section section-pad">
        <h2>{t.timeline.title}</h2>
        <div className="timeline">
          {t.timeline.events.map(({time, title, desc}) => (
            <div className="timeline-item" key={time}>
              <span className="timeline-dot" />
              <time>{time}</time>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quote-section relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageTrail
            items={[
              '/compimg-002.jpg',
              '/compimg-003.jpg',
              '/compimg-004.jpg',
              '/compimg-005.jpg',
              '/compimg-006.jpg',
              '/compimg-007.jpg',
              '/compimg-008.jpg',
              '/compimg-009.jpg',
              '/compimg-010.jpg',
              '/compimg-011.jpg',
              '/compimg-012.jpg'
            ]}
            variant={7}
          />
        </div>
        <div className="relative z-10 pointer-events-none flex flex-col items-center">
          <span>“</span>
          <h2>{t.quoteSection.quote.split('\n').map((line, i) => <span key={i}>{i === 1 ? <i>{line}</i> : line}<br/></span>)}</h2>
          <p>{t.quoteSection.author}</p>
          <div className="mt-12 text-[10px] tracking-[0.2em] uppercase text-[#D8B96A]/60 flex items-center gap-2">
            <Hand size={14} /> {t.quoteSection.instruction}
          </div>
        </div>
      </section>

      <section id="venue" className="venue-section section-pad">
        <div className="venue-image">
          <Image
            src={photos[3].src}
            alt="The wedding venue"
            width={800}
            height={1000}
          />
          <div className="venue-label">{t.venue.imageLabel}</div>
        </div>
        <div className="venue-copy">
          <h2>{t.venue.title.split('\n').map((line, i) => <span key={i}>{i === 1 ? <i>{line}</i> : line}<br/></span>)}</h2>
          <div className="venue-details">
            <strong>{t.venue.name}</strong>
            <span>{t.venue.location}</span>
            <span>{t.date.displayDate} · {t.venue.time}</span>
          </div>
          <a
            className="text-link"
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
          >
            {t.venue.openInMaps} <ArrowUpRight />
          </a>
        </div>
      </section>

      <section className="final-section">
        <Image
          src={photos[1].src}
          alt="Bride and groom celebrating together"
          fill
          quality={100}
          className="object-cover"
        />
        <div className="final-copy">
          <span className="eyebrow">{t.finalSection.eyebrow}</span>
          <h2>
            {t.finalSection.title
              .replace("{{name}}", guestName ? guestName : "")
              .split('\n')
              .map((line, i) => <span key={i}>{line}<br/></span>)}
          </h2>
          <div className="final-rule" />
          <p>
            {t.hero.name1} & {t.hero.name2}
          </p>
          <small>{t.finalSection.subtitle}</small>
        </div>
      </section>
    </main>
  );
}
