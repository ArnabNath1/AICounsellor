"use client";
import { useState, useEffect } from 'react';
import ScholarshipSearch from '@/components/ScholarshipSearch';

export default function Scholarships() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('profile');
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    // Mock scholarship data matching the holistic profile
    const recommendedScholarships = [
        {
            id: 1,
            name: "Global Excellence Scholarship",
            provider: "Technical University of Munich",
            amount: "Full Tuition + €800 Monthly",
            deadline: "July 15, 2026",
            match: 95,
            reason: "Matches your academic GPA (3.8+) and Research interest in Robotics."
        },
        {
            id: 2,
            name: "International Student Hackathon Grant",
            provider: "MLH Foundation",
            amount: "$5,000 One-time",
            deadline: "Open All Year",
            match: 88,
            reason: "Based on your hackathon experience and project portfolio."
        },
        {
            id: 3,
            name: "Fulbright Foreign Student Program",
            provider: "US Department of State",
            amount: "Fully Funded",
            deadline: "Oct 20, 2025",
            match: 82,
            reason: "Perfect for your profile level and target country (USA)."
        },
        {
            id: 4,
            name: "Women in Tech Scholarship",
            provider: "Google",
            amount: "$10,000 Stipend",
            deadline: "May 1, 2026",
            match: 90,
            reason: "Matches your field of study and technical skills."
        }
    ];

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scholarship Pipeline</h1>
                <p style={{ color: 'var(--text-muted)' }}>Financial tracking and automated matches based on your holistic profile.</p>
            </header>

            {/* AI Scholarship Search */}
            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Global Search</h2>
                <ScholarshipSearch profile={profile} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Personalized Matches</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {recommendedScholarships.map(s => (
                            <div key={s.id} className="premium-card" style={{ borderLeft: '4px solid #10b981' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', color: 'white' }}>{s.name}</h3>
                                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Provided by: {s.provider}</div>
                                    </div>
                                    <div style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '12px', fontWeight: 600 }}>
                                        {s.match}% Match
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Value</div>
                                        <div style={{ fontWeight: 600, color: 'white' }}>{s.amount}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline</div>
                                        <div style={{ fontWeight: 600, color: 'white' }}>{s.deadline}</div>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    💡 <b>Why you:</b> {s.reason}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>View Details</button>
                                    <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>Save to Pipeline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Targeted Pipeline</h2>
                    <div className="premium-card">
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your specified targets from the profile:</div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', color: 'white' }}>
                            {profile.scholarshipTargets || 'No manual targets added yet.'}
                        </div>
                        <button className="btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>Add Manual Item</button>

                        <div style={{ marginTop: '2.5rem' }}>
                            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Financial Summary</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Target Savings</span>
                                <span style={{ color: 'white' }}>$40,000</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Matched Potential</span>
                                <span style={{ color: '#10b981' }}>$65,000+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
