import Link from 'next/link';

export default function Footer() {
  return (
      <footer style={{ backgroundColor: '#1a0f08', color: '#f9f5ef' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-b border-espresso-400">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                    className="w-7 h-7 flex items-center justify-center"
                    style={{ backgroundColor: '#f9f5ef', borderRadius: '2px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="12" fill="#2c1810" rx="0.5" />
                    <rect x="9" y="5" width="5" height="9" fill="#2c1810" rx="0.5" opacity="0.7" />
                  </svg>
                </div>
                <span className="font-serif text-lg">PortfolioHub</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#9a8878' }}>
                Premium portfolio templates for the modern tech professional.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#6a5a4a' }}>
                Product
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/portfolios', label: 'Browse Templates' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/portfolios?category=FULL_STACK', label: 'Java / Full Stack' },
                  { href: '/portfolios?category=UI_UX_DESIGNER', label: 'UI/UX Design' },
                ].map((link) => (
                    <li key={link.href}>
                      <Link
                          href={link.href}
                          className="text-sm footer-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#6a5a4a' }}>
                Account
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/auth/signup', label: 'Sign Up' },
                  { href: '/auth/login', label: 'Log In' },
                  { href: '/dashboard', label: 'Dashboard' },
                ].map((link) => (
                    <li key={link.href}>
                      <Link
                          href={link.href}
                          className="text-sm footer-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#6a5a4a' }}>
                Legal
              </h4>
              <ul className="space-y-2.5">
                {[
                  { href: '#', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' },
                  { href: '#', label: 'License' },
                ].map((link) => (
                    <li key={link.href}>
                      <Link
                          href={link.href}
                          className="text-sm footer-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
            <p className="text-xs" style={{ color: '#6a5a4a' }}>
              © {new Date().getFullYear()} PortfolioHub. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: '#6a5a4a' }}>
              Made with care for tech professionals worldwide.
            </p>
          </div>
        </div>
      </footer>
  );
}