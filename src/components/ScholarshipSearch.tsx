"use client";
import { useState } from 'react';

interface Scholarship {
    id: number;
    name: string;
    provider: string;
    amount: string;
    deadline: string;
    match: number;
    reason: string;
    link?: string;
}

export default function ScholarshipSearch({ profile }: { profile: any }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Scholarship[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/search-scholarships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, profile })
            });

            if (response.ok) {
                const data = await response.json();
                setResults(Array.isArray(data) ? data : (data.scholarships || []));
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginBottom: '3rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    className="glass-morph"
                    style={{ flex: 1, padding: '14px 20px', borderRadius: '12px', color: 'white' }}
                    placeholder="Search by name, country, or keyword (e.g. 'Women in STEM', 'Germany Master Grant')..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '0 32px' }}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {results.length > 0 && (
                <div className="animate-fade-in">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Search Results</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {results.map((s, idx) => (
                            <div key={idx} className="premium-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', color: 'white' }}>{s.name}</h4>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.provider}</div>
                                    </div>
                                    <div style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '11px', fontWeight: 600 }}>
                                        {s.match}% Match
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '13px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Value: </span>
                                        <span style={{ fontWeight: 600 }}>{s.amount}</span>
                                    </div>
                                    <div style={{ fontSize: '13px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Deadline: </span>
                                        <span style={{ fontWeight: 600 }}>{s.deadline}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                                    {s.reason}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    {s.link && (
                                        <a
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                            style={{ padding: '6px 16px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            Apply Now ↗
                                        </a>
                                    )}
                                    <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>View Details</button>
                                    <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Add to Drafts</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
