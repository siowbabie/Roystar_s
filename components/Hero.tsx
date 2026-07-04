'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Music } from 'lucide-react';

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered entrance animation using IntersectionObserver
    const elements = [
      { el: headlineRef.current, delay: 0 },
      { el: subRef.current, delay: 150 },
      { el: ctaRef.current, delay: 300 },
      { el: imageRef.current, delay: 100 },
    ];

    elements.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24"
      aria-label="Hero section"
    >
      {/* Soft background gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#68d4b5]/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#68d4b5]/8 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Left — text content */}
        <div className="flex flex-col gap-8">
          {/* Eyebrow label */}
          <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full bg-[#68d4b5]/10 text-[#3fbf9c] text-xs font-semibold tracking-widest uppercase">
            <Music size={12} />
            Premium Instruments
          </span>

          {/* Main headline */}
          <h1
            ref={headlineRef}
            style={{ opacity: 0, transform: 'translateY(28px)' }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-neutral-900 text-balance"
          >
            Music begins
            <br />
            with the{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#68d4b5]">right</span>
              {/* Underline accent */}
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 120 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6 C30 2, 90 2, 118 6"
                  stroke="#68d4b5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            </span>{' '}
            instrument.
          </h1>

          <p
            ref={subRef}
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            className="text-lg text-neutral-500 leading-relaxed max-w-md"
          >
            Roystar curates the world&apos;s finest classical and acoustic instruments
            — handcrafted for musicians who refuse to compromise on tone,
            touch, or beauty.
          </p>

          {/* CTA row */}
          <div
            ref={ctaRef}
            style={{ opacity: 0, transform: 'translateY(16px)' }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="#products" id="hero-shop-now" className="btn-primary">
              Shop Now
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link href="#about" id="hero-learn-more" className="btn-outline">
              Our Story
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex items-center gap-6 pt-2">
            {[
              { value: '50+', label: 'Instruments' },
              { value: '12 yr', label: 'of Craft' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-xl font-bold text-neutral-900">{stat.value}</span>
                <span className="text-xs text-neutral-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — hero image placeholder */}
        <div
          ref={imageRef}
          style={{ opacity: 0, transform: 'translateY(20px)' }}
          className="flex justify-center"
        >
          <div
            id="hero-image-placeholder"
            className="animate-float relative w-full max-w-sm aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#68d4b5]/20 border border-[#68d4b5]/10"
          >
            <Image
              src="/images/portable_digital_piano.jpg"
              alt="Yamaha Portable Digital Piano"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle gradient overlay at bottom for text readability */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-lg whitespace-nowrap z-10">
              <p className="text-xs text-neutral-500 font-medium">Starting from</p>
              <p className="text-lg font-bold text-neutral-900">$650</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom divider wave */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none"
      >
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40 Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  );
}
