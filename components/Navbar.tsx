'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, getCartCount } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2 group"
          aria-label="Roystar Home"
        >
          {/* Star icon mark */}
          <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#68d4b5] shadow-md shadow-[#68d4b5]/30 transition-transform duration-300 group-hover:scale-110">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            Roy<span className="text-[#68d4b5]">star</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-${link.label.toLowerCase()}`}
              className="nav-link text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            id="nav-cart"
            aria-label={`Shopping cart (${isMounted ? getCartCount() : 0} items)`}
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 group"
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.75}
              className="text-neutral-600 group-hover:text-neutral-900 transition-colors"
            />
            {isMounted && getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold bg-[#68d4b5] text-white rounded-full flex items-center justify-center leading-none">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            {mobileOpen ? (
              <X size={20} className="text-neutral-700" />
            ) : (
              <Menu size={20} className="text-neutral-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="glass mt-2 mx-4 rounded-2xl px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              id={`nav-mobile-${link.label.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-neutral-700 hover:text-[#68d4b5] transition-colors duration-200 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
