"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const userId = localStorage.getItem('userId');
        const user = localStorage.getItem('user');

        if (!userId || !user) {
            // Not logged in, redirect to login
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(user);
            setUserName(userData.name || 'User');
        } catch {
            setUserName('User');
        }

        setLoading(false);
    }, [router]);

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--background)' }}>Loading...</div>;
    }

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you absolutely sure? This will permanently delete your profile, shortlists, and all application data. This cannot be undone.")) {
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            router.push('/');
        }
    };

    const navItems = [
        { label: 'Control Center', icon: '📊', path: '/dashboard' },
        { label: 'AI Counsellor', icon: '🤖', path: '/dashboard/counsellor' },
        { label: 'University Discovery', icon: '🎓', path: '/dashboard/discover' },
        { label: 'University Locking', icon: '🔒', path: '/dashboard/locking' },
        { label: 'Scholarship Pipeline', icon: '💰', path: '/dashboard/scholarships' },
        { label: 'Application Guidance', icon: '📝', path: '/dashboard/guidance' },
        { label: 'Edit Profile', icon: '👤', path: '/dashboard/profile' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--glass-border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50
            }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '3rem', padding: '0 0.5rem' }}>
                    AI<span style={{ color: 'var(--primary)' }}>Counsellor</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-link ${pathname === item.path ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Logged in as</div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{userName}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary"
                        style={{ width: '100%', padding: '12px', fontSize: '14px', color: '#ff4d4f', borderColor: 'rgba(255, 77, 79, 0.2)' }}
                    >
                        🚪 Logout
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        style={{ background: 'transparent', border: 'none', color: 'rgba(255, 77, 79, 0.5)', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}
                    >
                        Permanently Delete Account
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem' }}>
                {children}
            </main>


        </div>
    );
}
