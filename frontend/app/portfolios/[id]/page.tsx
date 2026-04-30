'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api, Portfolio, categoryLabels, formatPrice } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="16" height="16" viewBox="0 0 12 12" fill={star <= Math.round(rating) ? '#2c1810' : 'none'} stroke={star <= Math.round(rating) ? '#2c1810' : '#d8d0c4'} strokeWidth="1">
            <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-ink-muted">{rating.toFixed(1)} ({count} reviews)</span>
    </div>
  );
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio & { hasPurchased?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'preview'>('overview');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/portfolios/${params.id}`)
      .then((res) => setPortfolio(res.data))
      .catch(() => router.push('/404'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to purchase');
      router.push('/auth/login');
      return;
    }

    if (!portfolio) return;

    if (portfolio.tier === 'FREE' || portfolio.price === 0) {
      toast.success('This template is free! Access it from your dashboard.');
      return;
    }

    setPurchasing(true);
    try {
      const { data } = await api.post('/payments/checkout', { portfolioId: portfolio.id });
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to start checkout');
    } finally {
      setPurchasing(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Please log in to review'); return; }

    try {
      await api.post(`/portfolios/${portfolio?.id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      // Refresh
      const res = await api.get(`/portfolios/${params.id}`);
      setPortfolio(res.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen" style={{ backgroundColor: '#f9f5ef' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="h-80 skeleton-shimmer mb-8 rounded" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="h-8 w-3/4 skeleton-shimmer rounded" />
              <div className="h-4 w-full skeleton-shimmer rounded" />
              <div className="h-4 w-4/5 skeleton-shimmer rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const tierBadge = { FREE: 'Free', PRO: 'Pro', AGENCY: 'Agency' }[portfolio.tier];

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: '#f9f5ef' }}>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 border-b border-ivory-400 overflow-hidden" style={{ backgroundColor: '#f0ebe0' }}>
        <Image
          src={portfolio.imageUrl}
          alt={portfolio.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 pb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="tag">{categoryLabels[portfolio.category]}</span>
              <span
                className="tag"
                style={{
                  backgroundColor: portfolio.tier === 'FREE' ? '#f0ebe0' : '#2c1810',
                  color: portfolio.tier === 'FREE' ? '#6a5a4a' : '#f9f5ef',
                }}
              >
                {tierBadge}
              </span>
            </div>
            <h1 className="font-serif text-display-sm text-ink">{portfolio.title}</h1>
            <StarRating rating={portfolio.rating} count={portfolio.ratingCount} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-ivory-400 mb-8">
              {(['overview', 'reviews', 'preview'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 text-sm font-medium capitalize transition-colors duration-200 border-b-2 -mb-px"
                  style={{
                    borderColor: activeTab === tab ? '#2c1810' : 'transparent',
                    color: activeTab === tab ? '#1a0f08' : '#6a5a4a',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <h2 className="font-serif text-2xl text-ink mb-4">About This Template</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  {portfolio.longDescription || portfolio.description}
                </p>

                <h3 className="font-serif text-lg text-ink mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {portfolio.techStack.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-ivory-200 border border-ivory-400" style={{ borderRadius: '2px' }}>
                  {[
                    { label: 'Downloads', value: portfolio.downloads.toLocaleString() },
                    { label: 'Category', value: categoryLabels[portfolio.category] },
                    { label: 'License', value: portfolio.tier === 'FREE' ? 'Personal' : 'Commercial' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-xs text-ink-muted uppercase tracking-wide mb-1">{stat.label}</div>
                      <div className="text-sm font-medium text-ink">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="font-serif text-2xl text-ink mb-6">Reviews</h2>

                {/* Review form */}
                <form onSubmit={handleReviewSubmit} className="mb-8 p-6 border border-ivory-400" style={{ backgroundColor: '#f0ebe0', borderRadius: '2px' }}>
                  <h3 className="font-medium text-ink mb-4 text-sm">Leave a Review</h3>
                  <div className="mb-4">
                    <label className="text-xs text-ink-muted block mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                        >
                          <svg width="20" height="20" viewBox="0 0 12 12" fill={star <= reviewForm.rating ? '#2c1810' : 'none'} stroke="#2c1810" strokeWidth="1">
                            <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this template..."
                    className="input-editorial w-full h-24 resize-none mb-3"
                    required
                  />
                  <button type="submit" className="btn-espresso">Submit Review</button>
                </form>

                {/* Reviews list */}
                <div className="space-y-4">
                  {portfolio.reviews && portfolio.reviews.length > 0 ? (
                    portfolio.reviews.map((review) => (
                      <div key={review.id} className="p-5 border border-ivory-400" style={{ backgroundColor: '#f9f5ef', borderRadius: '2px' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 flex items-center justify-center text-xs font-medium text-ivory-100 bg-espresso-500" style={{ borderRadius: '2px' }}>
                            {review.user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-ink">{review.user.name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill={s <= review.rating ? '#2c1810' : 'none'} stroke={s <= review.rating ? '#2c1810' : '#d8d0c4'} strokeWidth="1">
                                <path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8 3.4 9.2l.5-3L1.7 4.1l3-.4z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-ink-muted">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-ink-muted text-sm">No reviews yet. Be the first!</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                <h2 className="font-serif text-2xl text-ink mb-4">Live Preview</h2>
                {portfolio.previewUrl ? (
                  <div className="border border-ivory-400 overflow-hidden" style={{ borderRadius: '2px' }}>
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-ivory-400 bg-ivory-200">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-ivory-400" />
                        <div className="w-3 h-3 rounded-full bg-ivory-400" />
                        <div className="w-3 h-3 rounded-full bg-ivory-400" />
                      </div>
                      <span className="text-xs text-ink-muted flex-1 text-center">{portfolio.previewUrl}</span>
                    </div>
                    <div className="relative">
                      {portfolio.tier !== 'FREE' && !portfolio.hasPurchased && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,245,239,0.85)', backdropFilter: 'blur(4px)' }}>
                          <div className="text-center">
                            <p className="font-serif text-xl text-ink mb-2">Full Preview Locked</p>
                            <p className="text-sm text-ink-muted mb-4">Purchase this template to see the full preview</p>
                            <button onClick={handlePurchase} className="btn-espresso">Unlock Now</button>
                          </div>
                        </div>
                      )}
                      <iframe
                        src={portfolio.previewUrl}
                        className="w-full h-96 border-0"
                        title={`Preview of ${portfolio.title}`}
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-ink-muted text-sm">No live preview available for this template.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 border border-ivory-400 p-6"
              style={{ backgroundColor: '#f9f5ef', borderRadius: '2px' }}
            >
              <div className="text-center mb-6 pb-6 border-b border-ivory-400">
                <div className="font-serif text-3xl text-ink mb-1">
                  {formatPrice(portfolio.price, portfolio.tier)}
                </div>
                {portfolio.tier !== 'FREE' && (
                  <div className="text-xs text-ink-muted">one-time purchase</div>
                )}
              </div>

              {portfolio.hasPurchased ? (
                <div>
                  <div
                    className="flex items-center gap-2 justify-center py-3 mb-4 text-sm font-medium"
                    style={{ backgroundColor: '#f0ebe0', color: '#2c1810', borderRadius: '2px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3.5" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Purchased
                  </div>
                  <Link href="/dashboard" className="btn-espresso w-full text-center block">
                    Download from Dashboard
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="btn-espresso w-full mb-3 disabled:opacity-60"
                >
                  {purchasing ? 'Loading...' : portfolio.tier === 'FREE' ? 'Get Free Template' : `Get This — ${formatPrice(portfolio.price, portfolio.tier)}`}
                </button>
              )}

              {portfolio.previewUrl && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className="btn-outline w-full"
                >
                  View Preview
                </button>
              )}

              <ul className="mt-6 space-y-2">
                {[
                  portfolio.tier === 'FREE' ? 'Free forever' : 'Full source code',
                  'Fully responsive',
                  'Well documented',
                  portfolio.tier !== 'FREE' ? 'Commercial license' : 'Personal use',
                  '30-day support',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-ink-muted">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 3.5" stroke="#2c1810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
