import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Guestbook', href: '#guestbook' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F9FA] border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 font-black text-lg tracking-tight group">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-[#00C2FF] border-2 border-black font-black text-sm transition-all group-hover:shadow-[3px_3px_0px_0px_#00C2FF]">
            <Zap size={14} fill="currentColor" />
          </span>
          <span className="uppercase tracking-widest text-sm">DEV.PORTFOLIO</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-1 text-sm font-700 font-bold hover:bg-black hover:text-white transition-colors duration-100 border border-transparent hover:border-black"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            className="ml-3 btn-neo text-xs py-2 px-4"
          >
            Admin
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1 border-2 border-black"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t-2 border-black bg-[#F8F9FA]">
          <div className="flex flex-col py-2">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-sm font-bold border-b border-black hover:bg-black hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="mx-4 my-3 btn-neo text-xs py-2 text-center"
            >
              Admin Login
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
