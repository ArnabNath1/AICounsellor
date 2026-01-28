"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, verify credentials.
        // For the prototype, we assume success.
        localStorage.setItem('user', JSON.stringify({ name: 'Demo User', email: formData.email }));

        if (localStorage.getItem('onboardingComplete')) {
            router.push('/dashboard');
        } else {
            router.push('/onboarding');
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Continue your admission journey.</p>

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
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Signup</Link>
                </p>
            </div>
        </main>
    );
}
