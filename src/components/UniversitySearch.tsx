"use client";
import { useState, useEffect } from 'react';

interface University {
    name: string;
    country: string;
    web_pages: string[];
}

export default function UniversitySearch({ onAdd }: { onAdd: (uni: any) => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2) {
                searchUniversities();
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const searchUniversities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://universities.hipolabs.com/search?name=${query}`);
            const data = await response.json();
            setResults(data.slice(0, 10)); // Limit to top 10 for performance and UI
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="glass-morph"
                    style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        color: 'white',
                        fontSize: '16px',
                        border: '1px solid var(--glass-border)',
                        outline: 'none'
                    }}
                    placeholder="🔍 Search for any university in the world..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && (
                    <div style={{ position: 'absolute', right: '20px', top: '18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Searching...
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <div className="animate-fade-in" style={{
                    marginTop: '1rem',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {results.map((uni, idx) => (
                        <div key={idx} style={{
                            padding: '16px 20px',
                            borderBottom: idx === results.length - 1 ? 'none' : '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background 0.2s ease',
                            cursor: 'default'
                        }} className="search-result-item">
                            <div>
                                <div style={{ fontWeight: 600, color: 'white' }}>{uni.name}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📍 {uni.country}</div>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                onClick={() => onAdd({
                                    id: `hipo-${uni.name}-${uni.country}`,
                                    name: uni.name,
                                    country: uni.country,
                                    domain: uni.web_pages[0],
                                    source: 'external'
                                })}
                            >
                                + Shortlist
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
        .search-result-item:hover {
          background: rgba(255,255,255,0.03);
        }
      `}</style>
        </div>
    );
}
