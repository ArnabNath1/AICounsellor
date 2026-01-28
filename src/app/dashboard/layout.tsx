"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

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

                <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Logged in as</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Demo User</div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem' }}>
                {children}
            </main>

            <style jsx>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.03);
          color: white;
        }
        .nav-link.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
      `}</style>
        </div>
    );
}
