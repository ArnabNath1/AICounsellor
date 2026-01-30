"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Store user and userId in localStorage
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Check if user has completed onboarding
            const checkResponse = await fetch('/api/auth/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: data.user.id })
            });

            const checkData = await checkResponse.json();

            if (checkData.onboardingComplete) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Continue your admission journey.</p>

                {error && (
                    <div style={{ background: '#ff4444', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            className="glass-morph"
                            style={{ padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid var(--glass-border)' }}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            required
                            className="glass-morph"
                            style={{ padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid var(--glass-border)' }}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Signup</Link>
                </p>
            </div>
        </main>
    );
}
