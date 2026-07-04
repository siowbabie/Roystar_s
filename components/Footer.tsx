import Link from 'next/link';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Products', href: '#products' },
    { label: 'Contact', href: '#contact' },
    { label: 'Careers', href: '#' },
  ],
  Support: [
    { label: 'FAQ', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Warranty', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

// Social icons using inline SVG for zero external deps
const socialLinks = [
  {
    id: 'footer-instagram',
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'footer-twitter',
    label: 'X (Twitter)',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'footer-facebook',
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    id: 'footer-youtube',
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-neutral-900 text-neutral-400"
      aria-label="Site footer"
    >
      {/* Top CTA banner */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">
              Ready to find your instrument?
            </h2>
            <p className="text-neutral-400 text-sm">
              Browse our full collection of classical and acoustic instruments.
            </p>
          </div>
          <a href="#products" id="footer-browse-cta" className="btn-primary shrink-0">
            Browse Collection
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            {/* Logo */}
            <Link href="/" aria-label="Roystar Home" className="flex items-center gap-2 group w-fit">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#68d4b5] shadow-md shadow-[#68d4b5]/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
              <span className="text-xl font-bold text-white tracking-tight">
                Roy<span className="text-[#68d4b5]">star</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium classical and acoustic instruments, curated for musicians
              who demand excellence.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  id={s.id}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-500 hover:border-[#68d4b5] hover:text-[#68d4b5] transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
                {heading}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Roystar. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Crafted with care — for musicians, by musicians.
          </p>
        </div>
      </div>
    </footer>
  );
}
