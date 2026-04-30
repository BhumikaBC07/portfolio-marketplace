'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Portfolio, categoryLabels, formatPrice } from '@/lib/api';

interface PortfolioCardProps {
  portfolio: Portfolio;
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={star <= Math.round(rating) ? '#2c1810' : 'none'}
          stroke={star <= Math.round(rating) ? '#2c1810' : '#d8d0c4'}
          strokeWidth="1"
        >
          <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" />
        </svg>
      ))}
    </div>
  );
}

const tierBadgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  FREE: { bg: '#f0ebe0', text: '#6a5a4a', label: 'Free' },
  PRO: { bg: '#2c1810', text: '#f9f5ef', label: 'Pro' },
  AGENCY: { bg: '#1a0f08', text: '#f9f5ef', label: 'Agency' },
};

export default function PortfolioCard({ portfolio, className = '' }: PortfolioCardProps) {
  const tier = tierBadgeStyles[portfolio.tier] || tierBadgeStyles.FREE;

  return (
    <article
      className={`card-editorial group overflow-hidden ${className}`}
      style={{ borderRadius: '2px' }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-ivory-200">
        <Image
          src={portfolio.imageUrl}
          alt={portfolio.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Tier badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 text-xs font-medium tracking-wide"
          style={{ backgroundColor: tier.bg, color: tier.text, borderRadius: '2px' }}
        >
          {tier.label}
        </div>
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-2 py-1 text-xs font-medium tracking-wide"
          style={{ backgroundColor: 'rgba(249,245,239,0.92)', color: '#6a5a4a', borderRadius: '2px' }}
        >
          {categoryLabels[portfolio.category]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif text-lg text-ink leading-snug group-hover:text-espresso-400 transition-colors">
            {portfolio.title}
          </h3>
          <span
            className="text-base font-semibold text-ink whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {formatPrice(portfolio.price, portfolio.tier)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-ink-muted leading-relaxed mb-4 line-clamp-2">
          {portfolio.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {portfolio.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
          {portfolio.techStack.length > 4 && (
            <span className="tag text-ink-light">+{portfolio.techStack.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-ivory-400">
          <div className="flex items-center gap-2">
            <StarRating rating={portfolio.rating} />
            <span className="text-xs text-ink-muted">
              {portfolio.rating.toFixed(1)} ({portfolio.ratingCount})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href={`/portfolios/${portfolio.id}`}
              className="text-xs text-taupe-500 hover:text-ink transition-colors underline underline-offset-2"
            >
              Preview
            </Link>
            <span className="text-ink-light text-xs">·</span>
            <Link
              href={`/portfolios/${portfolio.id}`}
              className="btn-espresso text-xs px-3 py-1.5"
            >
              Get This
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// Skeleton loading card
export function PortfolioCardSkeleton() {
  return (
    <div className="border border-ivory-400 overflow-hidden" style={{ borderRadius: '2px' }}>
      <div className="h-48 skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-3/5 skeleton-shimmer rounded" />
          <div className="h-5 w-12 skeleton-shimmer rounded" />
        </div>
        <div className="h-4 w-full skeleton-shimmer rounded" />
        <div className="h-4 w-4/5 skeleton-shimmer rounded" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-14 skeleton-shimmer rounded" />
          ))}
        </div>
        <div className="flex justify-between pt-3 border-t border-ivory-400">
          <div className="h-4 w-24 skeleton-shimmer rounded" />
          <div className="h-7 w-20 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
