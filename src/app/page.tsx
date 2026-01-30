"use client";
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        background: 'rgba(10, 10, 12, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          AI<span style={{ color: 'var(--primary)' }}>Counsellor</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/login" className="btn-secondary">Login</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top center, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
      }}>
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: '100px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--primary)',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '2rem'
          }}>
            🚀 Next-Gen Education Planning
          </div>
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Plan your study-abroad journey with a guided <br />
            <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial' }}>AI Counsellor.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
            The first decision and execution system built to remove confusion and provide clarity, <br />
            direction, and momentum throughout your admission journey.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Begin Your Journey
            </Link>
            <Link href="/demo" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{
          marginTop: '6rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          <div className="premium-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>AI-Driven Insights</h3>
            <p style={{ color: 'var(--text-muted)' }}>Deeply understands your goals and academic background to provide tailored recommendations.</p>
          </div>
          <div className="premium-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Guided Execution</h3>
            <p style={{ color: 'var(--text-muted)' }}>Locked stages ensure you stay focused and disciplined throughout the process.</p>
          </div>
          <div className="premium-card">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Actionable Tasks</h3>
            <p style={{ color: 'var(--text-muted)' }}>Auto-generated to-do lists based on your selected universities and current stage.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px'
      }}>
        © 2026 AICounsellor - Built for the future of education.
      </footer>
    </main>
  );
}
