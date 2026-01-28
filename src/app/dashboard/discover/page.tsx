"use client";
import { useState, useEffect } from 'react';
import UniversitySearch from '@/components/UniversitySearch';

export default function Discover() {
    const [unis, setUnis] = useState<any[]>([]);
    const [shortlisted, setShortlisted] = useState<string[]>([]);

    useEffect(() => {
        const mockUnis = [
            { id: '1', name: "Stanford University", country: "USA", cost: "High", ranking: 3, acceptance: "Low", category: "Dream" },
            { id: '2', name: "University of Toronto", country: "Canada", cost: "Medium", ranking: 20, acceptance: "Medium", category: "Target" },
            { id: '3', name: "Technical University of Munich", country: "Germany", cost: "Low", ranking: 50, acceptance: "Medium", category: "Safe" },
            { id: '4', name: "Arizona State University", country: "USA", cost: "Medium", ranking: 150, acceptance: "High", category: "Safe" },
            { id: '5', name: "University of Oxford", country: "UK", cost: "High", ranking: 1, acceptance: "Low", category: "Dream" },
        ];
        setUnis(mockUnis);

        const saved = JSON.parse(localStorage.getItem('shortlisted') || '[]');
        setShortlisted(saved);
    }, []);

    const toggleShortlist = (id: string, uniData?: any) => {
        let newShortlisted;
        if (shortlisted.includes(id)) {
            newShortlisted = shortlisted.filter(item => item !== id);
        } else {
            newShortlisted = [...shortlisted, id];
            // If it's a new university from search, save its data so other pages can render it
            if (uniData) {
                const external = JSON.parse(localStorage.getItem('external_unis') || '{}');
                external[id] = { ...uniData, cost: 'Varies', acceptance: 'See AI', category: 'Match' };
                localStorage.setItem('external_unis', JSON.stringify(external));
            }
        }
        setShortlisted(newShortlisted);
        localStorage.setItem('shortlisted', JSON.stringify(newShortlisted));
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>University Discovery</h1>
                <p style={{ color: 'var(--text-muted)' }}>Explore institutions that match your budget and academic profile.</p>
            </header>

            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', opacity: 0.8 }}>Global Search</h2>
                <UniversitySearch onAdd={(uni) => toggleShortlist(uni.id, uni)} />
            </section>

            <section>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', opacity: 0.8 }}>Curated Recommendations</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {unis.map(uni => (
                        <div key={uni.id} className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '4px 12px', borderRadius: '100px', background: uni.category === 'Dream' ? 'rgba(244, 63, 94, 0.1)' : uni.category === 'Target' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: uni.category === 'Dream' ? '#f43f5e' : uni.category === 'Target' ? '#6366f1' : '#10b981', fontSize: '11px', fontWeight: 600 }}>
                                        {uni.category}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>#{uni.ranking} Worldwide</div>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>{uni.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>📍 {uni.country}</p>

                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Cost</div>
                                        <div style={{ fontWeight: 600 }}>{uni.cost}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Acceptance</div>
                                        <div style={{ fontWeight: 600 }}>{uni.acceptance}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={shortlisted.includes(uni.id) ? "btn-secondary" : "btn-primary"}
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => toggleShortlist(uni.id)}
                            >
                                {shortlisted.includes(uni.id) ? 'Remove Shortlist' : 'Add to Shortlist'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
