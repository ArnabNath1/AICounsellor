"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);
    const [isParsing, setIsParsing] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const response = await fetch('/api/parse-cv', {
                    method: 'POST',
                    body: JSON.stringify({
                        fileBase64: base64,
                        fileName: file.name,
                        fileType: file.type
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Normalize values for select inputs
                    const levelMap: any = { 'high school': 'High School', 'bachelor': 'Bachelor', 'master': 'Master', 'bachelors': 'Bachelor', 'masters': 'Master' };
                    const degreeMap: any = { 'bachelor': 'Bachelor', 'master': 'Master', 'mba': 'MBA', 'phd': 'PhD', 'masters': 'Master', 'bachelors': 'Bachelor' };

                    const normalizedLevel = levelMap[data.level?.toLowerCase()] || data.level;
                    const normalizedTarget = degreeMap[data.targetDegree?.toLowerCase()] || data.targetDegree;

                    setFormData((prev: any) => ({
                        ...prev,
                        ...data,
                        level: ['High School', 'Bachelor', 'Master'].includes(normalizedLevel) ? normalizedLevel : prev.level,
                        targetDegree: ['Bachelor', 'Master', 'MBA', 'PhD'].includes(normalizedTarget) ? normalizedTarget : prev.targetDegree,
                    }));
                    alert("CV Re-parsed! Your profile has been updated with new information. Please review and save.");
                } else {
                    alert("Parsing failed. Please update fields manually.");
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error parsing file.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('profile', JSON.stringify(formData));
        alert("Profile updated! Your AI Counsellor now has a holistic view of your background.");
        router.push('/dashboard');
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>Holistic Profile Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Keep your bio updated. The more details you provide, the better the AI can guide you.</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isParsing ? '⌛ Parsing...' : '📤 Update via CV'}
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            onChange={handleFileUpload}
                            disabled={isParsing}
                        />
                    </button>
                    {isParsing && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, fontSize: '11px', color: 'var(--primary)', marginTop: '4px', whiteSpace: 'nowrap' }}>
                            Gemini is reading your file...
                        </div>
                    )}
                </div>
            </header>

            <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Core Academic */}
                    <div className="premium-card">
                        <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Core Academic & Goals</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current Level</label>
                                    <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.level || ''} onChange={e => setFormData({ ...formData, level: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GPA</label>
                                    <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} placeholder="e.g. 3.8/4.0, 8.5/10.0 or 85%" value={formData.gpa || ''} onChange={e => setFormData({ ...formData, gpa: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Degree Major</label>
                                <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.degree || ''} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Degree Level</label>
                                    <select className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.targetDegree || ''} onChange={e => setFormData({ ...formData, targetDegree: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Bachelor">Bachelor's</option>
                                        <option value="Master">Master's</option>
                                        <option value="PhD">PhD</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Desired Field</label>
                                    <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.field || ''} onChange={e => setFormData({ ...formData, field: e.target.value })} placeholder="e.g. Artificial Intelligence" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Countries</label>
                                    <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.countries || ''} onChange={e => setFormData({ ...formData, countries: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Annual Budget</label>
                                    <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.budget || ''} onChange={e => setFormData({ ...formData, budget: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Readiness */}
                    <div className="premium-card">
                        <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Exams & Readiness</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IELTS/TOEFL</label>
                                <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.ielts || ''} onChange={e => setFormData({ ...formData, ielts: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GRE/GMAT</label>
                                <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.gre || ''} onChange={e => setFormData({ ...formData, gre: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SOP Completion</label>
                            <select className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.sop || 'Not Started'} onChange={e => setFormData({ ...formData, sop: e.target.value })}>
                                <option value="Not Started">Not Started</option>
                                <option value="Draft">Draft In Progress</option>
                                <option value="Ready">Ready</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Holistic Professional */}
                    <div className="premium-card">
                        <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Experience & Projects</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Research Experience/Interests</label>
                                <textarea className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white', minHeight: '60px' }} value={formData.researchExperience || ''} onChange={e => setFormData({ ...formData, researchExperience: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Work Experience</label>
                                <textarea className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white', minHeight: '60px' }} value={formData.workExperience || ''} onChange={e => setFormData({ ...formData, workExperience: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Key Projects</label>
                                <textarea className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white', minHeight: '60px' }} value={formData.projects || ''} onChange={e => setFormData({ ...formData, projects: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Extras */}
                    <div className="premium-card">
                        <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Skills & Achievements</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Technical Skills</label>
                                <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.skills || ''} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Certifications & Extra-Curriculars</label>
                                <textarea className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white', minHeight: '60px' }} value={formData.certifications || ''} onChange={e => setFormData({ ...formData, certifications: e.target.value, extraCurriculars: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Scholarships</label>
                                <input className="glass-morph" style={{ padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.scholarshipTargets || ''} onChange={e => setFormData({ ...formData, scholarshipTargets: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn-primary" style={{ padding: '14px 40px' }}>Save Holistic Profile</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
