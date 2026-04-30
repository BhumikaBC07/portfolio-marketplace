'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

interface DashboardData {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
  purchases: Array<{
    id: string;
    amount: number;
    createdAt: string;
    portfolio: {
      id: string;
      title: string;
      imageUrl: string;
      tier: string;
      techStack: string[];
    };
  }>;
  _count: { purchases: number; reviews: number };
}

interface BioState {
  skills: string;
  jobTitle: string;
  experience: string;
  tone: 'professional' | 'creative' | 'minimal';
  result: string;
  loading: boolean;
}

const planColors: Record<string, { bg: string; text: string }> = {
  FREE: { bg: '#f0ebe0', text: '#6a5a4a' },
  PRO: { bg: '#2c1810', text: '#f9f5ef' },
  AGENCY: { bg: '#1a0f08', text: '#f9f5ef' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'ai-bio'>('purchases');
  const [bio, setBio] = useState<BioState>({
    skills: '',
    jobTitle: '',
    experience: '',
    tone: 'professional',
    result: '',
    loading: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    api.get('/user/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {
        router.push('/auth/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const generateBio = async () => {
    if (!bio.skills || !bio.jobTitle) {
      toast.error('Please fill in skills and job title');
      return;
    }
    setBio(b => ({ ...b, loading: true }));
    try {
      const { data: res } = await api.post('/ai/generate-bio', {
        skills: bio.skills.split(',').map(s => s.trim()),
        jobTitle: bio.jobTitle,
        experience: bio.experience,
        tone: bio.tone,
      });
      setBio(b => ({ ...b, result: res.bio, loading: false }));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate bio');
      setBio(b => ({ ...b, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9f5ef' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-espresso-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-ink-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const planStyle = planColors[data.plan] || planColors.FREE;

  return (
    <div className="pt-16 min-h-screen" style={{ backgroundColor: '#f9f5ef' }}>
      {/* Header */}
      <div className="border-b border-ivory-400 py-10 px-6 lg:px-8" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-widest text-taupe-500 uppercase mb-1">Dashboard</p>
              <h1 className="font-serif text-display-sm text-ink">Welcome back, {data.name.split(' ')[0]}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-ink-muted mb-1">Current Plan</div>
                <span
                  className="px-3 py-1 text-sm font-medium"
                  style={{ backgroundColor: planStyle.bg, color: planStyle.text, borderRadius: '2px' }}
                >
                  {data.plan}
                </span>
              </div>
              <Link href="/pricing" className="btn-outline text-xs">Upgrade Plan</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 pt-6 border-t border-ivory-400">
            {[
              { label: 'Purchased Templates', value: data._count.purchases },
              { label: 'Reviews Written', value: data._count.reviews },
              { label: 'Member Since', value: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-2xl text-ink">{stat.value}</div>
                <div className="text-xs text-ink-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex border-b border-ivory-400 mb-8">
          {(['purchases', 'ai-bio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-3 text-sm font-medium capitalize transition-colors duration-200 border-b-2 -mb-px"
              style={{
                borderColor: activeTab === tab ? '#2c1810' : 'transparent',
                color: activeTab === tab ? '#1a0f08' : '#6a5a4a',
              }}
            >
              {tab === 'ai-bio' ? '✨ AI Bio Generator' : 'My Portfolios'}
            </button>
          ))}
        </div>

        {activeTab === 'purchases' && (
          <div>
            {data.purchases.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-ink mb-3">No templates yet</p>
                <p className="text-ink-muted text-sm mb-6">Browse our collection and find your perfect portfolio.</p>
                <Link href="/portfolios" className="btn-espresso">Browse Templates</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-ivory-400">
                {data.purchases.map((purchase) => (
                  <div key={purchase.id} className="p-5" style={{ backgroundColor: '#f9f5ef' }}>
                    <div className="relative h-36 mb-4 overflow-hidden" style={{ borderRadius: '2px' }}>
                      <Image
                        src={purchase.portfolio.imageUrl}
                        alt={purchase.portfolio.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-lg text-ink mb-1">{purchase.portfolio.title}</h3>
                    <p className="text-xs text-ink-muted mb-3">
                      Purchased {new Date(purchase.createdAt).toLocaleDateString()}
                      {purchase.amount > 0 && ` · $${purchase.amount}`}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/portfolios/${purchase.portfolio.id}`}
                        className="btn-outline text-xs flex-1 text-center"
                      >
                        View Details
                      </Link>
                      <button
                        className="btn-espresso text-xs flex-1"
                        onClick={() => toast.success('Download link sent to your email!')}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-bio' && (
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl text-ink mb-2">AI Portfolio Bio Generator</h2>
            <p className="text-sm text-ink-muted mb-8">
              Enter your details and our AI will craft a compelling professional bio for your portfolio.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java Full-Stack Engineer"
                  value={bio.jobTitle}
                  onChange={(e) => setBio(b => ({ ...b, jobTitle: e.target.value }))}
                  className="input-editorial"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                  Skills (comma separated) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, React, PostgreSQL, Docker"
                  value={bio.skills}
                  onChange={(e) => setBio(b => ({ ...b, skills: e.target.value }))}
                  className="input-editorial"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 years of professional experience, recent graduate"
                  value={bio.experience}
                  onChange={(e) => setBio(b => ({ ...b, experience: e.target.value }))}
                  className="input-editorial"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">
                  Tone
                </label>
                <div className="flex gap-2">
                  {(['professional', 'creative', 'minimal'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setBio(b => ({ ...b, tone }))}
                      className="px-4 py-2 text-xs font-medium capitalize transition-all duration-200"
                      style={{
                        backgroundColor: bio.tone === tone ? '#2c1810' : '#f0ebe0',
                        color: bio.tone === tone ? '#f9f5ef' : '#6a5a4a',
                        borderRadius: '2px',
                        border: `1px solid ${bio.tone === tone ? '#2c1810' : '#d8d0c4'}`,
                      }}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateBio}
              disabled={bio.loading}
              className="btn-espresso mb-8 disabled:opacity-60"
            >
              {bio.loading ? '✨ Generating...' : '✨ Generate Bio'}
            </button>

            {bio.result && (
              <div className="border border-ivory-400 p-6" style={{ backgroundColor: '#f0ebe0', borderRadius: '2px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-ink text-sm">Your Generated Bio</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bio.result);
                      toast.success('Copied to clipboard!');
                    }}
                    className="text-xs text-taupe-500 hover:text-ink transition-colors underline"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-ink leading-relaxed">{bio.result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
