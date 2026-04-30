'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, Portfolio, categoryLabels } from '@/lib/api';
import PortfolioCard, { PortfolioCardSkeleton } from '@/components/PortfolioCard';

const sortOptions = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const tierOptions = [
  { value: '', label: 'All Tiers' },
  { value: 'FREE', label: 'Free' },
  { value: 'PRO', label: 'Pro' },
  { value: 'AGENCY', label: 'Agency' },
];

export default function PortfoliosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tier, setTier] = useState('');
  const [sort, setSort] = useState('rating');

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, page: String(page), limit: '12' };
      if (search) params.search = search;
      if (category) params.category = category;
      if (tier) params.tier = tier;

      const { data } = await api.get('/portfolios', { params });
      setPortfolios(data.portfolios);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, tier, sort, page]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPortfolios();
  };

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: '#f9f5ef' }}>
      {/* Page header */}
      <div
        className="border-b border-ivory-400 py-12 px-6 lg:px-8"
        style={{ backgroundColor: '#f5f0e8' }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-2">Templates</p>
          <h1 className="font-serif text-display-md text-ink">Browse Portfolios</h1>
          <p className="text-ink-muted mt-2 text-sm">{total} templates available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 pb-8 border-b border-ivory-400">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-editorial flex-1"
            />
            <button type="submit" className="btn-espresso px-4">
              Search
            </button>
          </form>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="input-editorial w-full md:w-48"
          >
            <option value="">All Categories</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Tier filter */}
          <select
            value={tier}
            onChange={(e) => { setTier(e.target.value); setPage(1); }}
            className="input-editorial w-full md:w-36"
          >
            {tierOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input-editorial w-full md:w-48"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(category || tier) && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-ink-muted">Active filters:</span>
            {category && (
              <button
                onClick={() => setCategory('')}
                className="tag flex items-center gap-1"
              >
                {categoryLabels[category]} ×
              </button>
            )}
            {tier && (
              <button
                onClick={() => setTier('')}
                className="tag flex items-center gap-1"
              >
                {tier} ×
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && portfolios.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-ink mb-3">No templates found</p>
            <p className="text-ink-muted text-sm">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearch(''); setCategory(''); setTier(''); setPage(1); }}
              className="btn-outline mt-6"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-ivory-400">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <PortfolioCardSkeleton key={i} />)
              : portfolios.map((p) => <PortfolioCard key={p.id} portfolio={p} />)
            }
          </div>
        )}

        {/* Pagination */}
        {!loading && total > 12 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-sm text-ink-muted">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <button
              disabled={page >= Math.ceil(total / 12)}
              onClick={() => setPage(p => p + 1)}
              className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
