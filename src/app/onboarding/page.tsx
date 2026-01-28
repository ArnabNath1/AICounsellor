"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isParsing, setIsParsing] = useState(false);
    const [formData, setFormData] = useState({
        // Academic
        level: '',
        degree: '',
        gpa: '',
        // Goals
        targetDegree: '',
        field: '',
        intake: '',
        countries: '',
        // Budget
        budget: '',
        funding: '',
        // Readiness
        ielts: '',
        gre: '',
        sop: 'Not Started',
        // Holistic Profile
        researchInterests: '',
        researchExperience: '',
        skills: '',
        workExperience: '',
        certifications: '',
        extraCurriculars: '',
        projects: '',
        scholarshipTargets: ''
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

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

                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        level: ['High School', 'Bachelor', 'Master'].includes(normalizedLevel) ? normalizedLevel : prev.level,
                        targetDegree: ['Bachelor', 'Master', 'MBA', 'PhD'].includes(normalizedTarget) ? normalizedTarget : prev.targetDegree,
                    }));
                    alert("CV Parsed! Information has been auto-filled. Please review each step.");
                    setStep(1); // Move to review phase
                } else {
                    alert("Parsing failed. Please fill manually.");
                    setStep(1);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file. Please try manual entry.");
            setStep(1);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('profile', JSON.stringify(formData));
        localStorage.setItem('onboardingComplete', 'true');
        router.push('/dashboard');
    };

    const renderStep = () => {
        if (isParsing) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="animate-pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <h3>Gemini is reading your CV...</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Extracting academic history, projects, and skills.</p>
                </div>
            );
        }

        switch (step) {
            case 0:
                return (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Welcome to AI Counsellor</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                            Fast-track your onboarding by uploading your academic CV, or start fresh manually.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '16px',
                                padding: '3rem 2rem',
                                position: 'relative',
                                background: 'rgba(255,255,255,0.02)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }} className="cv-upload-zone">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    onChange={handleFileUpload}
                                />
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📤</div>
                                <div style={{ fontWeight: 600, color: 'white' }}>Upload Academic CV</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>PDF, DOCX supported (Max 5MB)</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                            </div>

                            <button type="button" className="btn-secondary" style={{ width: '100%', padding: '14px' }} onClick={() => setStep(1)}>
                                Start Manually
                            </button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Academic Background</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Current Education Level</label>
                                <select
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    value={formData.level || ''}
                                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                                >
                                    <option value="">Select Level</option>
                                    <option value="High School">High School</option>
                                    <option value="Bachelor">Bachelor's Degree</option>
                                    <option value="Master">Master's Degree</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Major/Degree</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="e.g. Computer Science"
                                    value={formData.degree || ''}
                                    onChange={e => setFormData({ ...formData, degree: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>GPA / Percentage</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="e.g. 3.8/4.0 or 85%"
                                    value={formData.gpa || ''}
                                    onChange={e => setFormData({ ...formData, gpa: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Study Goals & Budget</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Target Degree & Field</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        className="glass-morph"
                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', color: 'white' }}
                                        value={formData.targetDegree || ''}
                                        onChange={e => setFormData({ ...formData, targetDegree: e.target.value })}
                                    >
                                        <option value="">Degree</option>
                                        <option value="Bachelor">Bachelor's</option>
                                        <option value="Master">Master's</option>
                                        <option value="MBA">MBA</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                                    <input
                                        type="text"
                                        className="glass-morph"
                                        style={{ flex: 2, padding: '12px', borderRadius: '8px', color: 'white' }}
                                        placeholder="Field of Study"
                                        value={formData.field || ''}
                                        onChange={e => setFormData({ ...formData, field: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Preferred Countries</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="e.g. USA, Canada, Germany"
                                    value={formData.countries || ''}
                                    onChange={e => setFormData({ ...formData, countries: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Annual Budget (USD)</label>
                                <select
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    value={formData.budget || ''}
                                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                >
                                    <option value="">Select Range</option>
                                    <option value="<20k">Less than $20,000</option>
                                    <option value="20k-40k">$20,000 - $40,000</option>
                                    <option value="40k+">$40,000+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Research & Professional</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Research Interests & Experience</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="e.g. Machine Learning, NLP (Include experience if any)"
                                    value={formData.researchExperience || ''}
                                    onChange={e => setFormData({ ...formData, researchExperience: e.target.value, researchInterests: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Work Experience</label>
                                <textarea
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Roles, Companies, Duration..."
                                    value={formData.workExperience || ''}
                                    onChange={e => setFormData({ ...formData, workExperience: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Key Projects</label>
                                <textarea
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Describe your most impactful projects..."
                                    value={formData.projects || ''}
                                    onChange={e => setFormData({ ...formData, projects: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Skills & Achievements</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Technical & Soft Skills</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="e.g. Python, Public Speaking, React"
                                    value={formData.skills || ''}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Certifications</label>
                                <input
                                    type="text"
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    placeholder="AWS, Google Cloud, Coursera..."
                                    value={formData.certifications || ''}
                                    onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Hackathons & Extra-Curriculars</label>
                                <textarea
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical' }}
                                    placeholder="MLH, Google Hash Code, Sports, Voluntering..."
                                    value={formData.extraCurriculars || ''}
                                    onChange={e => setFormData({ ...formData, extraCurriculars: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Scholarships & Readiness</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>Scholarship Targets</label>
                                <textarea
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical' }}
                                    placeholder="e.g. Fulbright, Commonwealth, University Specific..."
                                    value={formData.scholarshipTargets || ''}
                                    onChange={e => setFormData({ ...formData, scholarshipTargets: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>IELTS/TOEFL</label>
                                    <input
                                        type="text"
                                        className="glass-morph"
                                        style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                        placeholder="Score"
                                        value={formData.ielts || ''}
                                        onChange={e => setFormData({ ...formData, ielts: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>GRE/GMAT</label>
                                    <input
                                        type="text"
                                        className="glass-morph"
                                        style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                        placeholder="Score"
                                        value={formData.gre || ''}
                                        onChange={e => setFormData({ ...formData, gre: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label>SOP Status</label>
                                <select
                                    className="glass-morph"
                                    style={{ padding: '12px', borderRadius: '8px', color: 'white' }}
                                    value={formData.sop || 'Not Started'}
                                    onChange={e => setFormData({ ...formData, sop: e.target.value })}
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="Draft">Draft In Progress</option>
                                    <option value="Ready">Ready</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                {/* Progress Bar */}
                {step > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '3rem' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{
                                flex: 1,
                                height: '4px',
                                background: i <= step ? 'var(--primary)' : 'var(--glass-border)',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>
                )}

                <div className="premium-card">
                    <form onSubmit={e => e.preventDefault()}>
                        {renderStep()}

                        {step > 0 && !isParsing && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'flex-end' }}>
                                {step > 1 && (
                                    <button type="button" className="btn-secondary" onClick={prevStep}>Back</button>
                                )}
                                {step < 5 ? (
                                    <button type="button" className="btn-primary" onClick={nextStep}>Continue</button>
                                ) : (
                                    <button type="button" className="btn-primary" onClick={handleSubmit}>Complete Profile</button>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {step > 0 && (
                    <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {isParsing ? 'Processing...' : `Step ${step} of 5 • Review your details`}
                    </p>
                )}

                <style jsx>{`
                    .cv-upload-zone:hover {
                        border-color: var(--primary);
                        background: rgba(99, 102, 241, 0.05);
                    }
                `}</style>
            </div>
        </main>
    );
}
