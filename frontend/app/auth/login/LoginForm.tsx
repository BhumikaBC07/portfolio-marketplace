'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));
            toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
            const redirect = searchParams.get('redirect') || '/dashboard';
            router.push(redirect);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-16 min-h-screen flex" style={{ backgroundColor: '#f9f5ef' }}>
            {/* Left panel - decorative */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
                style={{ backgroundColor: '#2c1810' }}
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
                    <blockquote className="font-serif text-2xl mb-6 leading-relaxed" style={{ color: '#f9f5ef' }}>
                        "The template I found here got me an interview at Google within a week."
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 flex items-center justify-center text-sm font-medium"
                            style={{ backgroundColor: '#4a3a2a', color: '#f9f5ef', borderRadius: '2px' }}
                        >
                            RK
                        </div>
                        <div>
                            <div className="text-sm font-medium" style={{ color: '#f9f5ef' }}>Rahul Kumar</div>
                            <div className="text-xs" style={{ color: '#9a8878' }}>Software Engineer, Mountain View</div>
                        </div>
                    </div>
                </div>

                <div className="text-xs" style={{ color: '#6a5a4a' }}>
                    © {new Date().getFullYear()} PortfolioHub
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
                        <h1 className="font-serif text-display-sm text-ink mb-2">Welcome back</h1>
                        <p className="text-sm text-ink-muted">Sign in to access your templates and dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="••••••••"
                                className="input-editorial"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-espresso w-full py-3.5 disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-4 p-4 border border-ivory-400" style={{ backgroundColor: '#f0ebe0', borderRadius: '2px' }}>
                        <p className="text-xs font-medium text-ink-muted mb-2 uppercase tracking-wide">Demo Credentials</p>
                        <div className="space-y-1 text-xs text-ink-muted">
                            <p><span className="font-medium text-ink">User:</span> test@example.com / user123</p>
                            <p><span className="font-medium text-ink">Admin:</span> admin@portfoliohub.com / admin123</p>
                        </div>
                    </div>

                    <p className="text-center text-sm text-ink-muted mt-6">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-ink underline underline-offset-2 hover:text-espresso-500 transition-colors">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}