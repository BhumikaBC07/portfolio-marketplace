'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'free';

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));
            toast.success(`Welcome to PortfolioHub, ${data.user.name.split(' ')[0]}!`);
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const planLabels: Record<string, string> = {
        free: 'Free Plan',
        pro: 'Pro Plan — $9/mo',
        agency: 'Agency Plan — $29/mo',
    };

    return (
        <div className="pt-16 min-h-screen flex" style={{ backgroundColor: '#f9f5ef' }}>
            {/* Left decorative panel */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
                style={{ backgroundColor: '#1a0f08' }}
            >
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center" style={{ backgroundColor: '#f9f5ef', borderRadius: '2px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="5" height="12" fill="#2c1810" rx="0.5" />
                            <rect x="9" y="5" width="5" height="9" fill="#2c1810" rx="0.5" opacity="0.7" />
                        </svg>
                    </div>
                    <span className="font-serif text-lg" style={{ color: '#f9f5ef' }}>PortfolioHub</span>
                </Link>

                <div>
                    <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: '#6a5a4a' }}>
                        Why PortfolioHub?
                    </p>
                    <div className="space-y-6">
                        {[
                            { icon: '✪', title: 'Curated Quality', desc: 'Every template is hand-reviewed for design excellence and code quality.' },
                            { icon: '🛠', title: 'Built for Tech', desc: 'Templates specific to Java, full-stack, design, and data science roles.' },
                            { icon: '✅', title: 'AI-Powered', desc: 'Generate your professional bio instantly with our AI writer.' },
                        ].map((item) => (
                            <div key={item.title} className="flex gap-4">
                                <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: '#6a5a4a' }}>{item.icon}</span>
                                <div>
                                    <div className="text-sm font-medium mb-1" style={{ color: '#f9f5ef' }}>{item.title}</div>
                                    <div className="text-sm leading-relaxed" style={{ color: '#9a8878' }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-xs" style={{ color: '#6a5a4a' }}>
                    Join 1,200+ tech professionals who've already signed up.
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
                            <div className="w-6 h-6 flex items-center justify-center bg-espresso-500" style={{ borderRadius: '2px' }}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <rect x="2" y="2" width="5" height="12" fill="#f9f5ef" rx="0.5" />
                                    <rect x="9" y="5" width="5" height="9" fill="#f9f5ef" rx="0.5" opacity="0.7" />
                                </svg>
                            </div>
                            <span className="font-serif text-base text-ink">PortfolioHub</span>
                        </Link>

                        <h1 className="font-serif text-display-sm text-ink mb-2">Create your account</h1>
                        <p className="text-sm text-ink-muted">
                            Getting started with{' '}
                            <span
                                className="font-medium px-1.5 py-0.5"
                                style={{ backgroundColor: '#f0ebe0', color: '#2c1810', borderRadius: '2px', fontSize: '0.75rem' }}
                            >
                {planLabels[plan] || planLabels.free}
              </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Bhumika Sharma"
                                className="input-editorial"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="you@example.com"
                                className="input-editorial"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="Min. 8 characters"
                                className="input-editorial"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                value={form.confirmPassword}
                                onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                placeholder="Repeat your password"
                                className="input-editorial"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-espresso w-full py-3.5 disabled:opacity-60"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-ink-muted mt-4">
                        By signing up, you agree to our{' '}
                        <Link href="#" className="underline underline-offset-2">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="#" className="underline underline-offset-2">Privacy Policy</Link>.
                    </p>

                    <p className="text-center text-sm text-ink-muted mt-6">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-ink underline underline-offset-2 hover:text-espresso-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}