"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const Invitation = dynamic(() => import('@/components/wedding/invitation'), {
  ssr: false,
});

const SILK = [0.22, 1, 0.36, 1] as const;
const GRAVITY = [0.65, 0, 0.35, 1] as const;

type Phase = "arriving" | "closed" | "opening" | "revealed" | "entered";

export default function EnvelopeReveal({
  guestName,
}: {
  guestName?: string;
}) {
  const [phase, setPhase] = useState<Phase>("arriving");
  const prefersReduced = useReducedMotion();
  const { t } = useLanguage();

  // Lock scroll while intro is active
  useEffect(() => {
    document.body.style.overflow = phase === "entered" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Arriving → closed
  useEffect(() => {
    const t = setTimeout(() => setPhase("closed"), prefersReduced ? 200 : 800);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    // Give enough time for the drop + paper rise before revealing content
    setTimeout(() => setPhase("revealed"), 1800);
  };

  const handleEnter = () => setPhase("entered");

  // Auto-enter or Scroll/swipe to enter
  useEffect(() => {
    if (phase !== "revealed") return;
    
    // Auto redirect after a few seconds of reading
    const autoTimer = setTimeout(handleEnter, 6500);

    let touchStartY = 0;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 20) handleEnter();
    };
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (Math.abs(touchStartY - touchEndY) > 30) handleEnter();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      clearTimeout(autoTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [phase]);

  const displayName =
    guestName && guestName.trim().length > 0 ? guestName : "Our Beloved Guest";
  const isLongName = displayName.length > 20;

  const isArriving = phase === "arriving";
  const isClosed = phase === "closed";
  const isOpening = phase === "opening";
  const isRevealed = phase === "revealed";

  // Floating particles — generated client-side only to avoid hydration mismatch
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
      drift: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 1.6,
        duration: 16 + Math.random() * 14,
        delay: Math.random() * 6,
        drift: 20 + Math.random() * 30,
        opacity: 0.12 + Math.random() * 0.18,
      }))
    );
  }, []);

  return (
    <div className="relative w-full" style={{ minHeight: "100dvh" }}>
      {/* ============ REAL PAGE CONTENT (underneath) ============ */}
      <motion.div
        className="relative z-0 w-full"
        style={{ minHeight: "100dvh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "entered" ? 1 : 0 }}
        transition={{ duration: 1.4, ease: SILK }}
      >
        {(phase === "opening" || phase === "revealed" || phase === "entered") && <Invitation guestName={guestName} />}
      </motion.div>

      <AnimatePresence>
        {phase !== "entered" && (
          <motion.div
            key="stage"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{
              height: "100dvh",
              perspective: "2000px",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: SILK }}
          >
            {/* ============ BACKDROP ============ */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 42%, #3B090E 0%, #170607 55%, #0A0203 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: SILK }}
            />

            {/* Warm spotlight */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "min(150vw, 1100px)",
                height: "min(150vw, 1100px)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(216,185,106,0.14) 0%, rgba(184,148,82,0.05) 35%, transparent 70%)",
                filter: "blur(60px)",
                top: "48%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Particles */}
            {!prefersReduced && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background:
                        "radial-gradient(circle, rgba(229,205,145,0.9) 0%, rgba(184,148,82,0.4) 60%, transparent 100%)",
                      boxShadow: "0 0 6px rgba(216,185,106,0.4)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, p.opacity, p.opacity, 0],
                      y: [0, -p.drift, -p.drift * 1.5, -p.drift * 2],
                      x: [0, p.drift * 0.3, -p.drift * 0.2, p.drift * 0.1],
                    }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)",
              }}
            />

            {/* ==================================================
                ENVELOPE (image-based) — bigger on mobile
                ================================================== */}
            <motion.div
              className="absolute flex items-center justify-center z-20"
              style={{
                width: "min(135vw, 560px)",
                height: "min(135vw, 560px)",
                transformStyle: "preserve-3d",
              }}
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 26,
                filter: "blur(10px)",
                rotateX: 0,
              }}
              animate={
                isArriving
                  ? {
                      opacity: 0,
                      scale: 0.94,
                      y: 26,
                      filter: "blur(10px)",
                      rotateX: 0,
                    }
                  : isRevealed || phase === "entered"
                  ? {
                      opacity: 0,
                      scale: 1.06,
                      y: "70vh",
                      rotateX: 10,
                      filter: "blur(8px)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "blur(0px)",
                      rotateX: 0,
                    }
              }
              transition={{
                duration: isRevealed || phase === "entered" ? 1.3 : 2.0,
                delay: isRevealed || phase === "entered" ? 0.4 : 0,
                ease: isRevealed || phase === "entered" ? GRAVITY : SILK,
              }}
            >
              <div className="relative w-full aspect-square">
                {/* ===== CLOSED ENVELOPE IMAGE ===== */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isClosed || isArriving ? 1 : 0,
                  }}
                  transition={{
                    duration: 2.0,
                    delay: 0,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/images/envelope.png"
                    alt=""
                    width={2048}
                    height={2048}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>

                {/* ===== OPEN ENVELOPE IMAGE (fades in over closed one) ===== */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isClosed || isArriving ? 0 : 1,
                  }}
                  transition={{
                    duration: 2.0,
                    delay: 0,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/images/envelopOpen.png"
                    alt=""
                    width={2048}
                    height={2048}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>

                {/* ============ WAX SEAL (overlay) ============ */}
                <motion.button
                  onClick={handleOpen}
                  disabled={!isClosed}
                  className="absolute z-30 cursor-pointer focus:outline-none pointer-events-auto"
                  style={{
                    width: "34%",
                    height: "34%",
                    top: "33%",
                    left: "50%",
                    x: "-50%",
                  }}
                  initial={{ scale: 0, opacity: 0, rotate: -8 }}
                  animate={
                    isOpening
                      ? {
                          scale: 1.5,
                          opacity: 0,
                          rotate: 12,
                          filter: "blur(8px)",
                        }
                      : isClosed
                      ? { scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={
                    isOpening
                      ? { duration: 0.7, ease: GRAVITY }
                      : { duration: 1.0, delay: 2.0, ease: SILK }
                  }
                  whileHover={isClosed ? { scale: 1.05 } : {}}
                  whileTap={isClosed ? { scale: 0.95 } : {}}
                  aria-label="Open invitation"
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={
                      isClosed && !prefersReduced
                        ? {
                            scale: [1, 1.03, 1],
                            filter: [
                              "drop-shadow(0 8px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 0px rgba(216,185,106,0))",
                              "drop-shadow(0 10px 26px rgba(0,0,0,0.75)) drop-shadow(0 0 14px rgba(216,185,106,0.35))",
                              "drop-shadow(0 8px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 0px rgba(216,185,106,0))",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/images/wax-seal.png"
                      alt=""
                      width={2048}
                      height={2048}
                      sizes="(max-width: 768px) 30vw, 250px"
                      priority
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </motion.div>
                </motion.button>

                {/* Pulsing ring around seal */}
                {isClosed && !prefersReduced && (
                  <motion.div
                    className="absolute z-20 pointer-events-none rounded-full"
                    style={{
                      width: "40%",
                      height: "40%",
                      top: "30%",
                      left: "50%",
                      x: "-50%",
                      border: "1px solid rgba(216,185,106,0.5)",
                    }}
                    animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 2.6,
                    }}
                  />
                )}

                {/* Tap hint below the envelope */}
                {isClosed && (
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: "-56px" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 2.8, ease: SILK }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        style={{
                          width: "32px",
                          height: "1px",
                          background:
                            "linear-gradient(90deg, transparent, #D8B96A, transparent)",
                        }}
                      />
                      <motion.span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "10px",
                          letterSpacing: "0.5em",
                          paddingLeft: "0.5em",
                          color: "#E5CD91",
                          textTransform: "uppercase",
                        }}
                        animate={
                          prefersReduced
                            ? {}
                            : { opacity: [0.55, 1, 0.55] }
                        }
                        transition={{
                          duration: 3.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {t.card.tapSeal}
                      </motion.span>
                      <div
                        style={{
                          width: "32px",
                          height: "1px",
                          background:
                            "linear-gradient(90deg, transparent, #D8B96A, transparent)",
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ==================================================
                INVITATION PAPER — fills screen on mobile
                ================================================== */}
            <motion.div
              className="absolute flex items-center justify-center z-30 pointer-events-none"
              style={{
                width: "min(104vw, 820px)",
                height: "min(150vw, 1180px)",
              }}
              initial={{ opacity: 0, scale: 0.85, y: 40, filter: "blur(8px)" }}
              animate={
                isRevealed
                  ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                  : isOpening
                  ? { opacity: 1, scale: 0.95, y: 20, filter: "blur(4px)" }
                  : { opacity: 0, scale: 0.85, y: 40, filter: "blur(8px)" }
              }
              transition={{
                duration: 0.9,
                delay: isOpening ? 0.3 : 0,
                ease: SILK,
              }}
            >
              <Image
                src="/images/invitation-paper.png"
                alt=""
                width={2048}
                height={2048}
                sizes="(max-width: 768px) 100vw, 820px"
                priority
                className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />

              <AnimatePresence>
                {(isRevealed || isOpening) && (
                  <motion.div
                    key="content"
                    className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <InvitationContent
                      isRevealed={isRevealed}
                      displayName={displayName}
                      isLongName={isLongName}
                      prefersReduced={!!prefersReduced}
                      onEnter={handleEnter}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   INVITATION CONTENT
   ============================================================ */
function InvitationContent({
  isRevealed,
  displayName,
  isLongName,
  prefersReduced,
  onEnter,
}: {
  isRevealed: boolean;
  displayName: string;
  isLongName: boolean;
  prefersReduced: boolean;
  onEnter: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-8 py-12">
      {/* Ornament branch */}
      <motion.div
        className="mb-5"
        style={{ width: "64px", height: "64px" }}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
        animate={
          isRevealed
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.7, filter: "blur(6px)" }
        }
        transition={{ duration: 1.2, delay: 0.3, ease: SILK }}
      >
        <Image
          src="/images/ornament-branch.png"
          alt=""
          width={1024}
          height={1024}
          sizes="100px"
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      </motion.div>

      {/* THE WEDDING OF */}
      <motion.span
        className="uppercase mb-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.55em",
          paddingLeft: "0.55em",
          color: "black",
        }}
        initial={{ opacity: 0, y: 10, letterSpacing: "0.75em" }}
        animate={
          isRevealed
            ? { opacity: 1, y: 0, letterSpacing: "0.55em" }
            : { opacity: 0, y: 10, letterSpacing: "0.75em" }
        }
        transition={{ duration: 1.1, delay: 0.6, ease: SILK }}
      >
        {t.hero.theWeddingOf}
      </motion.span>

      {/* NEBIYU */}
      <motion.div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(2rem, 7vw, 3rem)",
          lineHeight: 1.1,
          color: "#170607",
          letterSpacing: "0.01em",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 1.2, delay: 0.9, ease: SILK }}
      >
        {t.hero.name1}
      </motion.div>

      {/* & divider */}
      <motion.div
        className="flex items-center gap-3 my-3"
        initial={{ opacity: 0, y: 8 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 1.1, delay: 1.2, ease: SILK }}
      >
        <div
          style={{
            width: "32px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #8E6D34, transparent)",
          }}
        />
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "#8E6D34",
          }}
        >
          &amp;
        </span>
        <div
          style={{
            width: "32px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #8E6D34, transparent)",
          }}
        />
      </motion.div>

      {/* Hewan */}
      <motion.div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(2rem, 7vw, 3rem)",
          lineHeight: 1.1,
          color: "#170607",
          letterSpacing: "0.01em",
        }}
        initial={{ opacity: 0, y: 14 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 1.2, delay: 1.5, ease: SILK }}
      >
        {t.hero.name2}
      </motion.div>

      {/* Hairline */}
      <motion.div
        style={{
          width: "60px",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #8E6D34, transparent)",
          marginTop: "20px",
          marginBottom: "20px",
        }}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={
          isRevealed
            ? { opacity: 0.85, scaleX: 1 }
            : { opacity: 0, scaleX: 0.4 }
        }
        transition={{ duration: 1.2, delay: 1.8, ease: SILK }}
      />

      {/* Request the pleasure of */}
      <motion.p
        className="w-full text-center max-w-[80%]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: 1.5,
          letterSpacing: "0.2em",
          color: "#5c4722",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 1.1, delay: 2.1, ease: SILK }}
      >
        {t.hero.request}
      </motion.p>

      {/* Guest name + shimmer */}
      <div className="relative inline-block mb-4">
        <motion.span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: isLongName
              ? "clamp(1.1rem, 4vw, 1.5rem)"
              : "clamp(1.5rem, 6vw, 2.1rem)",
            color: "#100304",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            display: "inline-block",
          }}
          initial={{ opacity: 0, y: 12, letterSpacing: "0.15em" }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, letterSpacing: "0.02em" }
              : { opacity: 0, y: 12, letterSpacing: "0.15em" }
          }
          transition={{ duration: 1.4, delay: 2.4, ease: SILK }}
        >
          {displayName}
        </motion.span>

        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(229,205,145,0.85) 50%, transparent 60%)",
            backgroundSize: "250% 100%",
            mixBlendMode: "overlay",
          }}
          initial={{ backgroundPosition: "-150% 0", opacity: 0 }}
          animate={
            isRevealed
              ? { backgroundPosition: "250% 0", opacity: [0, 1, 1, 0] }
              : {}
          }
          transition={{ duration: 1.8, delay: 3.0, ease: SILK }}
        />
      </div>


    </div>
  );
}