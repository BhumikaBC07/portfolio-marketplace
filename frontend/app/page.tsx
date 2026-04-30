'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, Portfolio, categoryLabels } from '@/lib/api';
import PortfolioCard, { PortfolioCardSkeleton } from '@/components/PortfolioCard';
import PricingTable from '@/components/PricingTable';

const Hero3D = lazy(() => import('@/components/Hero3D'));

const testimonials = [
  {
    quote: 'I landed my dream Java backend role at a Series B startup within 3 weeks of publishing my PortfolioHub template. The quality is unreal.',
    name: 'Arjun Mehta',
    title: 'Senior Java Engineer, Bangalore',
    avatar: 'AM',
  },
  {
    quote: 'As a self-taught developer, having a polished portfolio was game-changing. The editorial design impressed every recruiter I spoke to.',
    name: 'Priya Sharma',
    title: 'Full Stack Developer, Hyderabad',
    avatar: 'PS',
  },
  {
    quote: 'The AI bio generator alone is worth the Pro subscription. It wrote something I never could have articulated myself.',
    name: 'Kavya Nair',
    title: 'UX Designer, Chennai',
    avatar: 'KN',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Browse Templates',
    description: 'Explore our curated collection of templates built specifically for tech professionals.',
  },
  {
    step: '02',
    title: 'Choose Your Plan',
    description: 'Pick Free to start or Pro/Agency for premium templates and full download access.',
  },
  {
    step: '03',
    title: 'Customize & Deploy',
    description: 'Edit with your details, deploy to Vercel or Netlify in minutes, and start applying.',
  },
];

function FeaturedSection() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/portfolios/featured')
      .then((res) => setPortfolios(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#f9f5ef' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-3">Featured</p>
            <h2 className="font-serif text-display-sm text-ink">Editor's Picks</h2>
          </div>
          <Link href="/portfolios" className="btn-outline self-start md:self-auto">
            View All Portfolios →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-ivory-400">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <PortfolioCardSkeleton key={i} />
              ))
            : portfolios.map((p) => (
                <PortfolioCard key={p.id} portfolio={p} />
              ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    // Delay 3D load slightly for LCP
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ backgroundColor: '#f9f5ef' }}
      >
        {/* 3D Background */}
        {heroLoaded && (
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        )}

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Pre-headline */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-ivory-400 text-xs font-medium tracking-widest uppercase text-taupe-600"
            style={{ backgroundColor: 'rgba(249,245,239,0.8)', borderRadius: '1px', backdropFilter: 'blur(4px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-espresso-500" />
            Over 1,200 professionals hired
          </div>

          <h1
            className="font-serif mb-6 animate-fade-up"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#1a0f08',
            }}
          >
            Find Your Perfect
            <br />
            <em style={{ fontStyle: 'italic', color: '#2c1810' }}>Portfolio.</em>
            <br />
            Get Hired.
          </h1>

          <p
            className="text-lg mb-10 max-w-xl mx-auto animate-fade-up-delay"
            style={{ color: '#6a5a4a', fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}
          >
            Premium portfolio templates for Java engineers, full-stack developers, UI/UX designers,
            and data scientists. Stand out from 1,000 applicants.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay">
            <Link href="/portfolios" className="btn-espresso px-8 py-4 text-sm">
              Browse Portfolios
            </Link>
            <Link href="/auth/signup" className="btn-outline px-8 py-4 text-sm">
              Get Started Free
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-ivory-400"
          >
            {[
              { value: '16+', label: 'Premium Templates' },
              { value: '4', label: 'Tech Categories' },
              { value: '1.2k+', label: 'Professionals Hired' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl text-ink">{stat.value}</div>
                <div className="text-xs text-ink-muted tracking-wide mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-ink-muted tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-ivory-400 animate-pulse" />
        </div>
      </section>

      {/* Category quick links */}
      <section
        className="py-8 px-6 lg:px-8 border-t border-b border-ivory-400"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 md:justify-center">
            <span className="text-xs font-medium tracking-widest text-taupe-500 uppercase mr-4">Browse by:</span>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link
                key={key}
                href={`/portfolios?category=${key}`}
                className="tag hover:bg-espresso-500 hover:text-ivory-100 hover:border-espresso-500 transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured portfolios */}
      <FeaturedSection />

      {/* How it works */}
      <section className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#f0ebe0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-3">Process</p>
            <h2 className="font-serif text-display-sm text-ink">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-ivory-400">
            {howItWorks.map((step, index) => (
              <div
                key={step.step}
                className="p-10"
                style={{
                  backgroundColor: '#f9f5ef',
                  borderRight: index < 2 ? '1px solid #d8d0c4' : 'none',
                }}
              >
                <div
                  className="font-serif text-5xl mb-6"
                  style={{ color: '#d8d0c4' }}
                >
                  {step.step}
                </div>
                <h3 className="font-serif text-xl text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingTable />

      {/* Testimonials */}
      <section className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#f9f5ef' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-3">Stories</p>
            <h2 className="font-serif text-display-sm text-ink">
              Real People,<br />Real Outcomes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-ivory-400">
            {testimonials.map((t, index) => (
              <div
                key={t.name}
                className="p-8"
                style={{
                  backgroundColor: index === 1 ? '#f0ebe0' : '#f9f5ef',
                  borderRight: index < 2 ? '1px solid #d8d0c4' : 'none',
                }}
              >
                {/* Quote mark */}
                <div
                  className="font-serif text-5xl mb-4 leading-none"
                  style={{ color: '#d8d0c4' }}
                >
                  "
                </div>

                <p className="text-sm leading-relaxed text-ink-muted mb-6 italic font-serif text-base">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-ivory-400">
                  <div
                    className="w-9 h-9 flex items-center justify-center text-xs font-medium text-ivory-100"
                    style={{ backgroundColor: '#2c1810', borderRadius: '2px' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{t.name}</div>
                    <div className="text-xs text-ink-muted">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-24 px-6 lg:px-8 text-center"
        style={{ backgroundColor: '#2c1810' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-serif mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#f9f5ef', lineHeight: '1.2' }}
          >
            Your next role starts with the right portfolio.
          </h2>
          <p className="mb-8" style={{ color: '#9a8878', fontFamily: 'Inter, sans-serif' }}>
            Join thousands of tech professionals who've used PortfolioHub to land their dream jobs.
          </p>
          <Link
            href="/portfolios"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#f9f5ef', color: '#2c1810', borderRadius: '2px' }}
          >
            Start Browsing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
