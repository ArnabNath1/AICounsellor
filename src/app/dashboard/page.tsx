"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [stage, setStage] = useState(1);
    const [strength, setStrength] = useState(0);
    const [lockedUniName, setLockedUniName] = useState('');

    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete IELTS Preparation', status: 'Pending', category: 'Exam' },
        { id: 2, title: 'Update CV with latest projects', status: 'Completed', category: 'Profile' },
        { id: 3, title: 'Shortlist 5 Universities', status: 'Pending', category: 'Discovery' },
    ]);

    useEffect(() => {
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
            const p = JSON.parse(savedProfile);
            setProfile(p);

            // Calculate Profile Strength (Holistic)
            let s = 20; // Base
            if (p.level && p.degree) s += 15;
            if (p.ielts || p.gre) s += 15;
            if (p.researchExperience) s += 10;
            if (p.workExperience) s += 10;
            if (p.skills) s += 10;
            if (p.projects) s += 10;
            if (p.sop === 'Ready') s += 10;
            setStrength(Math.min(s, 100));

            // Determine Stage
            const shortlisted = JSON.parse(localStorage.getItem('shortlisted') || '[]');
            const lockedId = localStorage.getItem('lockedUni');

            if (lockedId) {
                setStage(4);
                const externalUnis = JSON.parse(localStorage.getItem('external_unis') || '{}');
                const mockUnis = [
                    { id: '1', name: "Stanford University" },
                    { id: '2', name: "University of Toronto" },
                    { id: '3', name: "Technical University of Munich" },
                    { id: '4', name: "Arizona State University" },
                    { id: '5', name: "University of Oxford" },
                ];
                const uni = [...mockUnis, ...(Object.values(externalUnis) as any[])].find((u: any) => u.id === lockedId);
                setLockedUniName(uni?.name || 'Selected University');
            } else if (shortlisted.length > 0) {
                setStage(3);
            } else {
                setStage(2);
            }
        }
    }, []);

    const getStageInfo = () => {
        switch (stage) {
            case 1: return { name: 'Building Profile', next: 'Discovery' };
            case 2: return { name: 'Discovering Universities', next: 'Shortlisting' };
            case 3: return { name: 'Finalizing Universities', next: 'Locking Decision' };
            case 4: return { name: 'Preparing Applications', next: 'Submission' };
            default: return { name: 'Onboarding', next: 'Start' };
        }
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));
    };

    if (!profile) return <div>Loading Profile...</div>;

    const stageInfo = getStageInfo();

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome back, Explorer</h1>
                <p style={{ color: 'var(--text-muted)' }}>Your admission strategy is in Stage {stage}: {stageInfo.name}</p>
            </header>

            {/* Stats / Overview Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '0.5rem' }}>Profile Strength</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: strength > 70 ? '#10b981' : '#f59e0b' }}>{strength}%</div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '1rem' }}>
                        <div style={{ width: `${strength}%`, height: '100%', background: strength > 70 ? '#10b981' : '#f59e0b', borderRadius: '3px' }} />
                    </div>
                </div>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '0.5rem' }}>Active Focus</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stage === 4 ? 'Applications' : 'Discovery'}</div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {stage === 4 ? `Working on ${lockedUniName}` : `Researching ${profile.countries}`}
                    </p>
                </div>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '0.5rem' }}>Next Goal</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stageInfo.next}</div>
                    <div style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '0.5rem', fontWeight: 600 }}>Action Required</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Primary Profile Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>Core Profile</h2>
                            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => router.push('/dashboard/profile')}>Edit Full Profile</button>
                        </div>
                        <div className="premium-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Academics</div>
                                <div style={{ fontSize: '15px' }}>{profile.degree} (GPA: {profile.gpa})</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Target Intake</div>
                                <div style={{ fontSize: '15px' }}>{profile.intake}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Preferred Countries</div>
                                <div style={{ fontSize: '15px' }}>{profile.countries}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>Budget Range</div>
                                <div style={{ fontSize: '15px' }}>{profile.budget}/Year</div>
                            </div>
                        </div>
                    </section>

                    {/* Holistic Profile Section */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Holistic Bio</h2>
                        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {profile.researchExperience && (
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Research & Interests</div>
                                    <div style={{ fontSize: '14px', color: 'white', lineHeight: 1.5 }}>{profile.researchExperience}</div>
                                </div>
                            )}
                            {profile.workExperience && (
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Work Experience</div>
                                    <div style={{ fontSize: '14px', color: 'white', lineHeight: 1.5 }}>{profile.workExperience}</div>
                                </div>
                            )}
                            {profile.projects && (
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Featured Projects</div>
                                    <div style={{ fontSize: '14px', color: 'white', lineHeight: 1.5 }}>{profile.projects}</div>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Skills</div>
                                    <div style={{ fontSize: '14px', color: 'white' }}>{profile.skills || 'None listed'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Certifications</div>
                                    <div style={{ fontSize: '14px', color: 'white' }}>{profile.certifications || 'None listed'}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Scholarship Widget */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Scholarships</h2>
                        <div className="premium-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', marginBottom: '1rem' }}>🎯 Target Scholarships</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                                {profile.scholarshipTargets || 'Define your targets in onboarding or profile settings.'}
                            </div>
                            <button className="btn-secondary" style={{ width: '100%', fontSize: '12px', borderColor: 'rgba(16, 185, 129, 0.3)' }} onClick={() => router.push('/dashboard/scholarships')}>Find More Scholarships</button>
                        </div>
                    </section>

                    {/* AI To-Do List */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>AI Action Items</h2>
                        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tasks.map(task => (
                                <div key={task.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                                    border: task.status === 'Completed' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer'
                                }} onClick={() => toggleTask(task.id)}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '6px',
                                        border: '2px solid',
                                        borderColor: task.status === 'Completed' ? '#10b981' : 'var(--glass-border)',
                                        background: task.status === 'Completed' ? '#10b981' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        {task.status === 'Completed' && '✓'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                                            color: task.status === 'Completed' ? 'var(--text-muted)' : 'white'
                                        }}>
                                            {task.title}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.category}</div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const title = prompt("Enter task title:");
                                    if (title) {
                                        setTasks([...tasks, { id: Date.now(), title, status: 'Pending', category: 'Manual' }]);
                                    }
                                }}
                                style={{
                                    marginTop: '0.5rem',
                                    background: 'transparent',
                                    border: '1px dashed var(--glass-border)',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    color: 'var(--text-muted)',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                + Add Task
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
