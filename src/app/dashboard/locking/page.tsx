"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Locking() {
    const router = useRouter();
    const [shortlisted, setShortlisted] = useState<any[]>([]);
    const [lockedId, setLockedId] = useState<string | null>(null);

    useEffect(() => {
        const savedShortlist = JSON.parse(localStorage.getItem('shortlisted') || '[]');
        const externalUnis = JSON.parse(localStorage.getItem('external_unis') || '{}');
        const mockUnis = [
            { id: '1', name: "Stanford University", country: "USA" },
            { id: '2', name: "University of Toronto", country: "Canada" },
            { id: '3', name: "Technical University of Munich", country: "Germany" },
            { id: '4', name: "Arizona State University", country: "USA" },
            { id: '5', name: "University of Oxford", country: "UK" },
        ];

        // Merge mock and external
        const allPossible: any[] = [...mockUnis, ...Object.values(externalUnis)];
        const filtered = allPossible.filter((u: any) => savedShortlist.includes(u.id));

        setShortlisted(filtered);
        setLockedId(localStorage.getItem('lockedUni'));
    }, []);

    const handleLock = (id: string) => {
        if (lockedId === id) {
            if (confirm("Are you sure you want to unlock this university? This will pause your application strategy.")) {
                setLockedId(null);
                localStorage.removeItem('lockedUni');
            }
        } else {
            setLockedId(id);
            localStorage.setItem('lockedUni', id);
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Decision Locking</h1>
                <p style={{ color: 'var(--text-muted)' }}>Commit to your top choice to unlock specific application guidance.</p>
            </header>

            {shortlisted.length === 0 ? (
                <div className="premium-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔍</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No shortlisted universities yet.</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Head over to Discovery to add universities to your shortlist first.</p>
                    <button className="btn-primary" onClick={() => router.push('/dashboard/discover')}>Discover Universities</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {shortlisted.map(uni => (
                        <div key={uni.id} className="premium-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: lockedId === uni.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)', background: lockedId === uni.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--glass-bg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                    🏛️
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{uni.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{uni.country}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                {lockedId === uni.id && (
                                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>🔒</span> Locked & Active
                                    </div>
                                )}
                                <button
                                    className={lockedId === uni.id ? "btn-secondary" : "btn-primary"}
                                    onClick={() => handleLock(uni.id)}
                                >
                                    {lockedId === uni.id ? 'Unlock Decision' : 'Lock University'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {lockedId && (
                <div className="animate-fade-in" style={{ marginTop: '3rem', padding: '2rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>🎉 Decision Confirmed</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your application strategy for {shortlisted.find(u => u.id === lockedId)?.name} is now ready.</p>
                    <button className="btn-primary" onClick={() => router.push('/dashboard/guidance')}>View Application Tasks</button>
                </div>
            )}
        </div>
    );
}
