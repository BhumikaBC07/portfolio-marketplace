'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { api, Portfolio, categoryLabels } from '@/lib/api';

interface AdminStats {
  totalPortfolios: number;
  totalUsers: number;
  totalPurchases: number;
  revenue: number;
}

const emptyForm = {
  title: '',
  description: '',
  longDescription: '',
  category: 'FULL_STACK' as const,
  price: 0,
  tier: 'FREE' as const,
  previewUrl: '',
  imageUrl: '',
  techStack: '',
  featured: false,
};

export default function AdminPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolios' | 'add'>('portfolios');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { router.push('/auth/login'); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== 'ADMIN') { router.push('/'); return; }

    fetchPortfolios();
  }, [router]);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/portfolios', { params: { limit: 100 } });
      setPortfolios(data.portfolios);
    } catch (err) {
      toast.error('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.put(`/portfolios/${editingId}`, payload);
        toast.success('Portfolio updated!');
      } else {
        await api.post('/portfolios', payload);
        toast.success('Portfolio created!');
      }

      setForm(emptyForm);
      setEditingId(null);
      setActiveTab('portfolios');
      fetchPortfolios();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Portfolio) => {
    setForm({
      title: p.title,
      description: p.description,
      longDescription: p.longDescription || '',
      category: p.category as any,
      price: p.price,
      tier: p.tier as any,
      previewUrl: p.previewUrl || '',
      imageUrl: p.imageUrl,
      techStack: p.techStack.join(', '),
      featured: p.featured,
    });
    setEditingId(p.id);
    setActiveTab('add');
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/portfolios/${id}`);
      toast.success('Portfolio deleted');
      fetchPortfolios();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-ivory-100 border border-ivory-400 text-ink placeholder:text-ink-light focus:outline-none focus:border-espresso-500 transition-colors text-sm";
  const labelClass = "block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5";

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: '#f9f5ef' }}>
      {/* Header */}
      <div className="border-b border-ivory-400 py-10 px-6 lg:px-8" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: '#2c1810', color: '#f9f5ef', borderRadius: '2px' }}
            >
              ADMIN
            </span>
            <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase">Control Panel</p>
          </div>
          <h1 className="font-serif text-display-sm text-ink">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex border-b border-ivory-400 mb-8">
          {(['portfolios', 'add'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === 'portfolios') { setEditingId(null); setForm(emptyForm); } }}
              className="px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px"
              style={{
                borderColor: activeTab === tab ? '#2c1810' : 'transparent',
                color: activeTab === tab ? '#1a0f08' : '#6a5a4a',
              }}
            >
              {tab === 'portfolios' ? `All Portfolios (${portfolios.length})` : editingId ? 'Edit Portfolio' : '+ Add Portfolio'}
            </button>
          ))}
        </div>

        {activeTab === 'portfolios' && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 skeleton-shimmer rounded" />
                ))}
              </div>
            ) : (
              <div className="border border-ivory-400 divide-y divide-ivory-400">
                {portfolios.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4" style={{ backgroundColor: '#f9f5ef' }}>
                    <div className="relative w-16 h-12 flex-shrink-0 overflow-hidden" style={{ borderRadius: '2px' }}>
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-ink text-sm truncate">{p.title}</h3>
                        {p.featured && (
                          <span className="text-xs px-1.5 py-0.5" style={{ backgroundColor: '#f0ebe0', color: '#6a5a4a', borderRadius: '2px' }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-ink-muted">
                        <span>{categoryLabels[p.category]}</span>
                        <span>·</span>
                        <span className="font-medium" style={{ color: p.tier === 'FREE' ? '#6a5a4a' : '#2c1810' }}>{p.tier}</span>
                        <span>·</span>
                        <span>★ {p.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{p.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="btn-outline text-xs px-3 py-1.5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="text-xs px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        style={{ borderRadius: '2px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <h2 className="font-serif text-2xl text-ink">
              {editingId ? 'Edit Portfolio' : 'Add New Portfolio'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                  placeholder="Portfolio title"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Short Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  className={`${inputClass} h-20 resize-none`}
                  style={{ borderRadius: '2px' }}
                  placeholder="Brief description (shown on cards)"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Long Description</label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => setForm(f => ({ ...f, longDescription: e.target.value }))}
                  className={`${inputClass} h-28 resize-none`}
                  style={{ borderRadius: '2px' }}
                  placeholder="Full description (shown on detail page)"
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value as any }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Tier *</label>
                <select
                  required
                  value={form.tier}
                  onChange={(e) => setForm(f => ({ ...f, tier: e.target.value as any, price: e.target.value === 'FREE' ? 0 : e.target.value === 'PRO' ? 9 : 29 }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                >
                  <option value="FREE">Free</option>
                  <option value="PRO">Pro</option>
                  <option value="AGENCY">Agency</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                />
              </div>

              <div>
                <label className={labelClass}>Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Preview URL</label>
                <input
                  type="url"
                  value={form.previewUrl}
                  onChange={(e) => setForm(f => ({ ...f, previewUrl: e.target.value }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                  placeholder="https://... (live demo URL)"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Tech Stack (comma separated) *</label>
                <input
                  type="text"
                  required
                  value={form.techStack}
                  onChange={(e) => setForm(f => ({ ...f, techStack: e.target.value }))}
                  className={inputClass}
                  style={{ borderRadius: '2px' }}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-espresso-500"
                  />
                  <span className="text-sm text-ink">Feature this portfolio on the homepage</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-espresso disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Update Portfolio' : 'Create Portfolio'}
              </button>
              <button
                type="button"
                onClick={() => { setForm(emptyForm); setEditingId(null); setActiveTab('portfolios'); }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
