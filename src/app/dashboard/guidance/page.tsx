"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Guidance() {
    const router = useRouter();
    const [lockedUni, setLockedUni] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        const lockedId = localStorage.getItem('lockedUni');
        if (!lockedId) return;

        const externalUnis = JSON.parse(localStorage.getItem('external_unis') || '{}');
        const mockUnis = [
            { id: '1', name: "Stanford University", country: "USA" },
            { id: '2', name: "University of Toronto", country: "Canada" },
            { id: '3', name: "Technical University of Munich", country: "Germany" },
            { id: '4', name: "Arizona State University", country: "USA" },
            { id: '5', name: "University of Oxford", country: "UK" },
        ];

        const allPossible: any[] = [...mockUnis, ...Object.values(externalUnis)];
        const uni = allPossible.find((u: any) => u.id === lockedId);

        if (uni) {
            setLockedUni(uni);

            // AI generated tasks based on the university
            const aiTasks = [
                { id: 101, title: `Finalize Statement of Purpose for ${uni.name}`, deadline: 'Feb 15, 2026', type: 'SOP' },
                { id: 102, title: `Request 3 Letters of Recommendation`, deadline: 'Feb 20, 2026', type: 'LOR' },
                { id: 103, title: `Upload Academic Transcripts`, deadline: 'Mar 1, 2026', type: 'Docs' },
                { id: 104, title: `Complete International Application Form`, deadline: 'Mar 15, 2026', type: 'Form' },
            ];
            setTasks(aiTasks);
        }
    }, []);

    if (!lockedUni) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '10vh 2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🔒</div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Strategy Locked</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    You haven't committed to a university yet. Guidance and tasks are generated specifically for your locked institutions.
                </p>
                <button className="btn-primary" onClick={() => router.push('/dashboard/locking')}>Lock a University First</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Application Strategy: {lockedUni.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Tailored roadmap and documents required for your admission.</p>
                </div>
                <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                    🟢 Strategy Active
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Priority Tasks</h2>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>4 Tasks Generated</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map(task => (
                            <div key={task.id} className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Empty checkbox */}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'white' }}>{task.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Deadline: {task.deadline} • {task.type}</div>
                                </div>
                                <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '4px 12px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Required Documents</h2>
                    <div className="premium-card">
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                                <span style={{ color: 'var(--primary)' }}>📄</span> Official Transcripts
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                                <span style={{ color: 'var(--primary)' }}>📄</span> Passport Copy
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                                <span style={{ color: 'var(--primary)' }}>📄</span> English Proficiency Results
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px' }}>
                                <span style={{ color: 'var(--primary)' }}>📄</span> Proof of Funds
                            </li>
                        </ul>
                    </div>

                    <div className="premium-card" style={{ marginTop: '2rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>AI Insight</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            For {lockedUni.name}, emphasizing your technical skills in your SOP is highly recommended as they value research experience.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
