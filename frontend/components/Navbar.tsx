'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Simple user state from localStorage
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));

    const handleStorage = () => {
      const s = localStorage.getItem('user');
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/portfolios', label: 'Browse' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#f5f0e8',
        borderBottom: '1px solid #d8d0c4',
        boxShadow: scrolled ? '0 1px 12px rgba(26,15,8,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-7 h-7 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: '#2c1810', borderRadius: '2px' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" fill="#f9f5ef" rx="0.5" />
                <rect x="9" y="5" width="5" height="9" fill="#f9f5ef" rx="0.5" opacity="0.7" />
              </svg>
            </div>
            <span className="font-serif text-lg text-ink">PortfolioHub</span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm"
                style={{
                  color: pathname === link.href ? '#1a0f08' : '#6a5a4a',
                  fontWeight: pathname === link.href ? '500' : '400',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="nav-link text-sm">Dashboard</Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="nav-link text-sm">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-outline text-xs px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="nav-link text-sm">Login</Link>
                <Link href="/auth/signup" className="btn-espresso text-xs px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ivory-400 bg-navbar py-4 px-6 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block nav-link py-1" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="btn-outline w-full mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block nav-link py-1" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/signup" className="btn-espresso w-full mt-2 text-center block" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
