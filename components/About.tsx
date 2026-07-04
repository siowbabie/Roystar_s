'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Award, Headphones, Heart } from 'lucide-react';

const pillars = [
  {
    id: 'about-craftsmanship',
    icon: Award,
    title: 'Masterful Craftsmanship',
    description:
      'Every instrument in our collection is selected through a rigorous process, assessed by world-class luthiers and master piano technicians.',
  },
  {
    id: 'about-sound',
    icon: Headphones,
    title: 'Uncompromised Sound',
    description:
      'From the warmth of rosewood fingerboards to the resonance of hand-selected spruce soundboards, tone is never an afterthought.',
  },
  {
    id: 'about-passion',
    icon: Heart,
    title: 'A Passion for Music',
    description:
      'Roystar was born from a love of music and a belief that the right instrument changes everything — for students and professionals alike.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    pillarsRef.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 150);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    });
  }, []);

  return (
    <section
      id="about"
      className="section-padding bg-white"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Left — text */}
          <div
            ref={sectionRef}
            style={{ opacity: 0, transform: 'translateY(28px)' }}
            className="flex flex-col gap-6"
          >
            <span className="w-fit px-4 py-1.5 rounded-full bg-[#68d4b5]/10 text-[#3fbf9c] text-xs font-semibold tracking-widest uppercase">
              Our Story
            </span>
            <h2
              id="about-heading"
              className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-tight"
            >
              Instruments worthy
              <br />
              of your music.
            </h2>
            <p className="text-neutral-500 text-lg leading-relaxed">
              Founded by musicians for musicians, Roystar was built on a simple
              conviction: exceptional music begins with an exceptional instrument.
              We source, curate, and stand behind every piece in our catalogue.
            </p>
            <p className="text-neutral-500 leading-relaxed">
              From the student picking up a classical guitar for the first time,
              to the concert pianist seeking a grand worthy of the stage — we
              believe every player deserves an instrument that inspires them to
              reach higher.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: '2012', label: 'Founded' },
                { value: '4,200+', label: 'Happy Musicians' },
                { value: '18', label: 'Countries Served' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-neutral-900">{s.value}</span>
                  <span className="text-sm text-neutral-400 font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="relative h-80 md:h-full min-h-[380px] rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#68d4b5]/10">
             <Image
                src="/images/about-image.jpg"
                alt="Crafting a guitar"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
          </div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                ref={(el) => {
                  pillarsRef.current[i] = el;
                }}
                style={{ opacity: 0, transform: 'translateY(24px)' }}
                className="flex flex-col gap-4 p-8 rounded-3xl bg-neutral-50 hover:bg-[#68d4b5]/5 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#68d4b5]/15 flex items-center justify-center">
                  <Icon size={22} stroke="#68d4b5" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{pillar.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
