'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For individuals just starting out.',
    features: [
      'Access to all free portfolios',
      'Watermarked preview mode',
      'Community support',
      'Basic templates',
      'Personal use only',
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    tier: 'FREE',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For professionals ready to stand out.',
    features: [
      'All Free features',
      'Full access to Pro templates',
      'No watermarks',
      'AI bio generator',
      'Priority email support',
      'Commercial use license',
    ],
    cta: 'Start Pro',
    href: '/auth/signup?plan=pro',
    tier: 'PRO',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$29',
    period: 'per month',
    description: 'For teams and freelance studios.',
    features: [
      'All Pro features',
      'All Agency templates',
      'Team portfolio management',
      'Client presentation mode',
      'White-label exports',
      'Dedicated support',
      'Multi-seat license (up to 5)',
    ],
    cta: 'Start Agency',
    href: '/auth/signup?plan=agency',
    tier: 'AGENCY',
    highlight: false,
  },
];

export default function PricingTable() {
  return (
    <section className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#f0ebe0' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-4">Pricing</p>
          <h2 className="font-serif text-display-md text-ink mb-4">Simple, Transparent Plans</h2>
          <p className="text-ink-muted max-w-md mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            No hidden fees. Choose the plan that fits your needs and upgrade anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-ivory-400">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="relative p-8"
              style={{
                backgroundColor: plan.highlight ? '#2c1810' : '#f9f5ef',
                borderRight: index < 2 ? '1px solid #d8d0c4' : 'none',
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute top-4 right-4 px-2 py-0.5 text-xs font-medium tracking-wide"
                  style={{ backgroundColor: '#f9f5ef', color: '#2c1810', borderRadius: '1px' }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="font-serif text-2xl mb-1"
                  style={{ color: plan.highlight ? '#f9f5ef' : '#1a0f08' }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: plan.highlight ? '#c8bcac' : '#6a5a4a' }}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-serif text-4xl"
                    style={{ color: plan.highlight ? '#f9f5ef' : '#1a0f08' }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.highlight ? '#c8bcac' : '#6a5a4a' }}
                  >
                    /{plan.period}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="mb-6 h-px"
                style={{ backgroundColor: plan.highlight ? '#4a3a2a' : '#d8d0c4' }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <path
                        d="M2 7l3.5 3.5L12 3.5"
                        stroke={plan.highlight ? '#f9f5ef' : '#2c1810'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="text-sm"
                      style={{ color: plan.highlight ? '#e6ddd0' : '#6a5a4a' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: plan.highlight ? '#f9f5ef' : '#2c1810',
                  color: plan.highlight ? '#2c1810' : '#f9f5ef',
                  borderRadius: '2px',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink-muted mt-6">
          All plans include a 14-day money-back guarantee. No credit card required for Free.
        </p>
      </div>
    </section>
  );
}
