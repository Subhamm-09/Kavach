"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  MessageSquareHeart,
  AlertTriangle,
  FileText,
  Scale,
  Lock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  HeartHandshake,
  Fingerprint,
  Shield,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    href: "/safety",
    title: "Check your route",
    copy: "Read nearby conditions, avoid known hotspots, and choose a better-lit way home.",
    label: "Open safety map",
    icon: MapPin,
    tone: "#006d62",
    wash: "#dff4ee",
    number: "01",
  },
  {
    href: "/chat",
    title: "Talk it through",
    copy: "A private place to pause, make sense of what is happening, and find your next step.",
    label: "Start a conversation",
    icon: MessageSquareHeart,
    tone: "#a53f59",
    wash: "#fce9ed",
    number: "02",
  },
  {
    href: "/report",
    title: "Make a record",
    copy: "Capture an incident securely. Personal details are shielded before any authority view.",
    label: "Record an incident",
    icon: AlertTriangle,
    tone: "#b04a32",
    wash: "#fff0e8",
    number: "03",
  },
];

const loadingImages = ["/1.jpeg", "/2.jpeg", "/3.jpeg", "/4.jpeg"];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExitTransition, setIsExitTransition] = useState(false);

  // Lightweight HTML5 Canvas Spatial & Geospatial Environment
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes configuration
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 36;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ["rgba(0, 109, 98, ", "rgba(28, 155, 115, ", "rgba(101, 115, 111, "];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
        vy: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
        color: colors[i % colors.length],
      });
    }

    // Gentle Parallax Tracking
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / width - 0.5;
      const relY = (e.clientY - rect.top) / height - 0.5;
      targetParallaxX = relX * 24;
      targetParallaxY = relY * 24;
      setMousePos({ x: relX, y: relY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId && !prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    let time = 0;

    const render = () => {
      if (!isVisible) return;
      time += 0.008;

      // Smooth parallax interpolation
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Abstract Geospatial Grid Lines (Very Subtle)
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(101, 115, 111, 0.045)";

      const gridSize = isMobile ? 80 : 110;
      const startX = (currentParallaxX * 0.5) % gridSize;
      const startY = (currentParallaxY * 0.5) % gridSize;

      for (let x = startX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = startY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Subtle Topographic Contours
      const contourCount = isMobile ? 3 : 5;
      ctx.lineWidth = 1;
      for (let c = 0; c < contourCount; c++) {
        const offset = c * 70;
        const alpha = 0.035 + c * 0.008;
        ctx.strokeStyle = `rgba(0, 109, 98, ${alpha})`;
        ctx.beginPath();

        const baseY = height * 0.35 + offset + currentParallaxY * (0.4 + c * 0.15);
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= width; x += 40) {
          const wave =
            Math.sin(x * 0.003 + time * 0.7 + c * 1.2) * 28 +
            Math.cos(x * 0.006 - time * 0.5 + c) * 14;
          ctx.lineTo(x + currentParallaxX * (0.2 + c * 0.1), baseY + wave);
        }
        ctx.stroke();
      }

      // 3. Ambient Telemetry Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.alpha = 0.12 + Math.sin(time * 2 + i) * 0.08;
        }

        const px = p.x + currentParallaxX * 0.8;
        const py = p.y + currentParallaxY * 0.8;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle interconnecting telemetry vectors between close nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(0, 109, 98, ${0.05 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(p2.x + currentParallaxX * 0.8, p2.y + currentParallaxY * 0.8);
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  // Minimalist Cinematic Mint Loading (Pure visual rapid cycle on load/refresh)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Lock page scrolling while loading screen is active
    document.body.style.overflow = "hidden";

    const duration = 3800; // 3.8s total duration
    const intervalTime = 200; // 200ms rapid shutter cut

    // Rapid sequential cycling across images 1, 2, 3, 4
    const cycleTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loadingImages.length);
    }, intervalTime);

    const exitTimer = setTimeout(() => {
      clearInterval(cycleTimer);
      setIsExitTransition(true);
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 600); // 600ms smooth curtain dissolve
    }, duration);

    return () => {
      clearInterval(cycleTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* ========================================================================= */}
      {/* MINIMALIST CINEMATIC MINT LOADING SCREEN (Pure Background & Images Only)   */}
      {/* ========================================================================= */}
      {isLoading && (
        <div
          role="status"
          aria-label="Loading"
          className={`fixed inset-0 w-screen h-screen z-[100000] flex items-center justify-center p-6 select-none transition-opacity duration-600 ease-out ${
            isExitTransition ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            backgroundColor: "#dff4ee",
            backgroundImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, #eff9f4 0%, #dff4ee 55%, #c8e8db 100%)",
          }}
        >
          {/* Centerpiece Picture Mount */}
          <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] rounded-[32px] sm:rounded-[42px] overflow-hidden shadow-[0_28px_80px_rgba(23,51,47,0.22),0_4px_24px_rgba(0,109,98,0.12)] border-2 border-[#b8dfce] ring-8 ring-[#c7f9e5]/60 bg-[#081210]">
            {loadingImages.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-100 ${
                  idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                loading="eager"
                decoding="sync"
              />
            ))}
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION (Full Viewport Breakout)                        */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        aria-label="Kavach System Overview"
        className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 sm:-mt-10 min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden bg-[#f7f5ef] border-b border-[#dbe2dc]"
      >
        {/* Spatial HTML5 Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Ambient Radial Vignette & Depth Glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,253,248,0.7)_0%,rgba(247,245,239,0.95)_100%)]"
          aria-hidden="true"
        />

        {/* Signature Guardian Field (Artistic Orbital Protection Centerpiece) */}
        <div
          className="absolute right-[-12%] sm:right-[2%] lg:right-[6%] top-[10%] sm:top-[12%] lg:top-[10%] w-[330px] h-[330px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] pointer-events-none select-none z-10 opacity-40 sm:opacity-90 lg:opacity-100 transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0)`,
          }}
          aria-hidden="true"
        >
          {/* Outer Ring: Dashed Coordinate Track */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#006d62]/20 animate-[spin_60s_linear_infinite]" />

          {/* Coordinate HUD Markers on the Outer Ring */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#f7f5ef] border border-[#cfe2da] text-[9px] font-mono font-bold tracking-widest text-[#52635c]">
            20.3551° N
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#f7f5ef] border border-[#cfe2da] text-[9px] font-mono font-bold tracking-widest text-[#52635c]">
            85.8181° E
          </div>
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-[#f7f5ef] border border-[#cfe2da] text-[8px] font-mono font-bold tracking-widest text-[#72827b]">
            W
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-1.5 py-0.5 rounded-full bg-[#f7f5ef] border border-[#cfe2da] text-[8px] font-mono font-bold tracking-widest text-[#72827b]">
            E
          </div>

          {/* Middle Ring: Secondary Scanning Corridor */}
          <div className="absolute inset-[10%] rounded-full border border-[#006d62]/20 animate-[spin_40s_linear_infinite_reverse]" />

          {/* Restrained Radar Sweep */}
          <div
            className="absolute inset-[10%] rounded-full animate-[spin_12s_linear_infinite] opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(0, 109, 98, 0.08) 50deg, transparent 55deg)",
            }}
          />

          {/* Radiant Protective Field Glow Behind Core */}
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(130,224,190,0.45)_0%,rgba(0,109,98,0.08)_55%,transparent_75%)] blur-md" />

          {/* Central Guardian Artistic Emblem Medallion */}
          <div className="absolute inset-[20%] rounded-full p-2 sm:p-2.5 bg-[#fffdf8]/85 backdrop-blur-md shadow-[0_24px_64px_rgba(0,109,98,0.20),0_4px_16px_rgba(23,51,47,0.08)] border-2 border-[#b8e5d3] ring-8 ring-[#e8f7f0]/50 flex items-center justify-center overflow-hidden">
            <Image
              src="/guardian-emblem.png"
              alt="Kavach Guardian Emblem"
              width={420}
              height={420}
              priority
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />
            {/* Ambient Glass Sheen Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/25 pointer-events-none" />
          </div>

          {/* Floating Status Capsule */}
          <div className="absolute bottom-[13%] left-1/2 -translate-x-1/2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#fffdf8]/95 backdrop-blur-md border border-[#b8e5d3] shadow-[0_8px_20px_rgba(23,51,47,0.12)] flex items-center gap-2 whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1c9b73] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1c9b73]" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-[#006d62]">
              GUARDIAN PRESENCE • ACTIVE
            </span>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-24 lg:pt-28 pb-12">
          <div className="max-w-3xl space-y-8">
            {/* Guardian Status Indicator */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#cfe2da] bg-[#fffdf8]/90 backdrop-blur-md px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#006d62] shadow-[0_4px_14px_rgba(23,51,47,0.05)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1c9b73] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1c9b73]" />
              </span>
              <span>KAVACH • AUTONOMOUS SAFETY INTELLIGENCE</span>
            </div>

            {/* Powerful Editorial Headline */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#397066]">
                Proactive Environment Protection
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.055em] leading-[0.98] text-[#17332f]">
                THE WORLD AROUND YOU
                <br />
                <span className="bg-gradient-to-r from-[#17332f] via-[#006d62] to-[#1c9b73] bg-clip-text text-transparent">
                  IS ALWAYS CHANGING.
                </span>
              </h1>
            </div>

            {/* Supporting Statement */}
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#52635c] font-medium">
              An ambient safety intelligence layer. Kavach continuously observes your surroundings,
              predicts environmental risk, and guides you to safety—quietly, calmly, and without
              compromising your privacy.
            </p>

            {/* Primary Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/safety"
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#006d62] px-8 py-4 text-xs sm:text-sm font-bold tracking-wide text-white shadow-[0_12px_28px_rgba(0,109,98,0.26)] transition-all duration-300 hover:bg-[#00584f] hover:shadow-[0_16px_36px_rgba(0,109,98,0.36)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>ENTER GUARDIAN MODE</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-full border border-[#cfdad3] bg-[#fffdf8] px-6 py-4 text-xs sm:text-sm font-bold text-[#17332f] transition-all duration-200 hover:bg-white hover:border-[#006d62] hover:shadow-xs"
              >
                <span>Report an incident</span>
              </Link>
            </div>

            {/* Ambient System Telemetry Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#65736f]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1c9b73]" />
                <span className="font-semibold">Autonomous Guardian Mesh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#006d62]" />
                <span className="font-semibold">Illuminated Route Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#397066]" />
                <span className="font-semibold">Zero-PII Privacy Boundary</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Atmospheric Transition & Scroll Prompt */}
        <div className="relative z-20 w-full px-6 py-6 border-t border-[#dbe2dc]/60 bg-gradient-to-b from-transparent to-[#f7f5ef]/80 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#72827b]">
            <Shield className="h-3.5 w-3.5 text-[#006d62]" />
            <span>Perimeter Intelligence Layer</span>
          </div>

          <a
            href="#actions-section"
            className="group mx-auto sm:mx-0 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#52635c] hover:text-[#006d62] transition-colors"
          >
            <span>Explore Services</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXISTING FEATURE MODULES (Preserved with Smooth Transition)            */}
      {/* ========================================================================= */}
      <div id="actions-section" className="mx-auto max-w-6xl space-y-12 pt-6">
        {/* Human-Centered Safety Philosophy Card */}
        <section className="relative overflow-hidden rounded-[32px] border border-[#d5e2dc] bg-[#e8f1eb] px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[28px] border-[#c8e5da] opacity-70" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b8d8cc] bg-[#f9fcf9] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#397066]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1c9b73]" />
                A safer Bhubaneswar, in your pocket
              </div>
              <p className="mb-2 text-sm font-bold text-[#397066]">
                You do not have to figure it out alone.
              </p>
              <h2 className="max-w-2xl text-3xl sm:text-5xl font-extrabold leading-[1.02] tracking-[-0.05em] text-[#17332f]">
                Safety that feels{" "}
                <span className="font-[Playfair_Display] font-semibold italic">human.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#52635c]">
                Kavach helps you notice risks, respond calmly, and preserve what matters—without
                asking you to trade away your privacy.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/safety"
                  className="inline-flex items-center gap-2 rounded-full bg-[#006d62] px-5 py-3 text-xs font-bold text-white shadow-[0_10px_22px_rgba(0,109,98,.2)] transition hover:-translate-y-0.5"
                >
                  See my surroundings <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 rounded-full border border-[#bfd2c9] bg-[#fffdf8] px-5 py-3 text-xs font-bold text-[#17332f] transition hover:bg-white"
                >
                  Report an incident
                </Link>
              </div>
            </div>

            {/* Artistic Emblem Cameo */}
            <div className="hidden md:flex flex-col items-center justify-center shrink-0 pr-4">
              <div className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full p-2 bg-[#fffdf8]/90 backdrop-blur-sm border border-[#b8e5d3] shadow-[0_16px_36px_rgba(0,109,98,0.12)]">
                <div className="absolute -inset-2.5 rounded-full border border-dashed border-[#006d62]/20 animate-[spin_50s_linear_infinite]" />
                <Image
                  src="/guardian-emblem.png"
                  alt="Kavach Guardian Emblem"
                  width={208}
                  height={208}
                  className="w-full h-full object-cover rounded-full pointer-events-none"
                />
              </div>
              <p className="mt-3 text-[10px] lg:text-[11px] font-mono tracking-widest uppercase text-[#397066] font-bold text-center">
                Protection rooted in empathy
              </p>
            </div>
          </div>
        </section>

        {/* Action Pathways (Choose What You Need) */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-[#697b73]">
                Choose what you need
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-[-.05em] text-[#17332f]">
                Start with a small step.
              </h2>
            </div>
            <span className="hidden text-xs text-[#71827b] sm:block">
              Available whenever you need it
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {actions.map(({ href, title, copy, label, icon: Icon, tone, wash, number }) => (
              <Link
                href={href}
                key={href}
                className="group relative overflow-hidden rounded-[24px] border border-[#dbe2dc] bg-[#fffdf8] p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(23,51,47,.10)]"
              >
                <span className="absolute right-5 top-5 text-xs font-bold font-mono" style={{ color: tone }}>
                  {number}
                </span>
                <div
                  className="mb-7 grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ backgroundColor: wash, color: tone }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-extrabold tracking-[-.04em] text-[#17332f]">{title}</h3>
                <p className="mt-2 min-h-[60px] text-xs leading-5 text-[#65736f]">{copy}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-bold" style={{ color: tone }}>
                  {label}
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy & System Support Cards */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#dbe2dc] bg-[#fffdf8] p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-2 text-[#006d62]">
              <Fingerprint className="h-4 w-4" />
              <span className="text-[11px] font-extrabold uppercase tracking-[.12em]">
                Privacy by design
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-[-.04em] text-[#17332f]">
              Your identity stays yours.
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#65736f]">
              Reports are tokenized before authorities can view them. You remain in control of your story,
              with zero personally identifiable telemetry retention.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#17332f] p-6 sm:p-8 text-white">
            <div className="mb-3 flex items-center gap-2 text-[#a9dfd2]">
              <HeartHandshake className="h-4 w-4" />
              <span className="text-[11px] font-extrabold uppercase tracking-[.12em]">
                More support
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-[-.04em]">Help should be understandable.</h3>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold">
              <Link
                href="/cases"
                className="inline-flex items-center gap-1.5 text-[#e7f4ee] hover:text-white transition"
              >
                <FileText className="h-3.5 w-3.5 text-[#a9dfd2]" /> My cases
              </Link>
              <Link
                href="/legal"
                className="inline-flex items-center gap-1.5 text-[#e7f4ee] hover:text-white transition"
              >
                <Scale className="h-3.5 w-3.5 text-[#a9dfd2]" /> Legal help
              </Link>
              <Link
                href="/authority/login"
                className="inline-flex items-center gap-1.5 text-[#e7f4ee] hover:text-white transition"
              >
                <Lock className="h-3.5 w-3.5 text-[#a9dfd2]" /> Authority portal
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CINEMATIC LANDING FOOTER SHOWPIECE (Naari Cultural Sanctuary)          */}
        {/* ========================================================================= */}
        <section className="relative pt-6 sm:pt-10">
          {/* Ambient Glow Aura */}
          <div
            className="absolute inset-x-8 -top-6 h-64 bg-[radial-gradient(ellipse_at_center,rgba(0,109,98,0.12)_0%,rgba(28,155,115,0.06)_50%,transparent_75%)] blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Luxury Editorial Intro */}
          <div className="relative mb-8 sm:mb-12 text-center max-w-3xl mx-auto space-y-3 px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8decb] bg-[#e8f4ef] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#006d62] shadow-[0_2px_10px_rgba(0,109,98,0.06)]">
              <Sparkles className="h-3 w-3 text-[#1c9b73]" />
              <span>Dedicated to Nari Shakti</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-[#17332f] leading-[1.08]">
              Fearless in Her Journey.
              <br />
              <span className="font-[Playfair_Display] font-semibold italic text-[#006d62]">
                Uncompromising in Her Dignity.
              </span>
            </h2>
            <p className="text-xs sm:text-base text-[#52635c] leading-relaxed font-medium max-w-2xl mx-auto">
              Kavach is dedicated to the freedom, dignity, and fearless movement of every woman.
              Every street, every hour, and every journey belongs to her without fear.
            </p>
          </div>

          {/* Cinematic Gallery Artwork Mount */}
          <div className="group relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] border border-[#cfe0d7] bg-[#fffdf8] shadow-[0_28px_80px_rgba(23,51,47,0.12),0_4px_24px_rgba(0,109,98,0.08)] transition-all duration-700 hover:shadow-[0_36px_100px_rgba(0,109,98,0.20)]">
            {/* Top Minimalist Metadata Ribbons */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#17332f]/85 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-[#a9dfd2] uppercase shadow-md">
                Cultural Sanctuary • Naari
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 hidden sm:flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fffdf8]/90 backdrop-blur-md border border-[#cfe0d7] text-[9px] font-mono font-bold tracking-widest text-[#52635c] uppercase shadow-xs">
                Bhubaneswar, Odisha
              </span>
            </div>

            {/* High-Resolution Artwork Frame */}
            <div className="relative w-full overflow-hidden bg-white">
              <Image
                src="/naari.jpeg"
                alt="Naari — Celebrating Indian Classical Heritage and Divine Feminine Strength"
                width={2134}
                height={1238}
                className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />
              {/* Subtle Atmospheric Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17332f]/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Minimalist Inscription Bar */}
            <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-6 bg-[#fffdf8] border-t border-[#e2ece7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-0.5">
                <p className="text-xs sm:text-sm font-serif italic text-[#17332f] tracking-wide">
                  &ldquo;यत्र नार्यस्तु पूज्यन्ते रमन्ते तत्र देवताः&rdquo;
                </p>
                <p className="text-[11px] font-mono tracking-wider uppercase text-[#697b73]">
                  Where women are honored, divinity blossoms
                </p>
              </div>

              <Link
                href="/safety"
                className="inline-flex items-center gap-2 rounded-full bg-[#006d62] px-6 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(0,109,98,0.22)] transition hover:bg-[#00584f] hover:-translate-y-0.5 shrink-0"
              >
                <span>Walk with Kavach</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

