"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isParsing, setIsParsing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Voice Interview State
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceStep, setVoiceStep] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [fullConversation, setFullConversation] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if user is logged in
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }
        setLoading(false);
    }, [router]);

    const [formData, setFormData] = useState({
        level: '', degree: '', gpa: '',
        targetDegree: '', field: '', intake: '', countries: '',
        budget: '', funding: '',
        ielts: '', gre: '', sop: 'Not Started',
        researchInterests: '', researchExperience: '', skills: '',
        workExperience: '', certifications: '', extraCurriculars: '',
        projects: '', scholarshipTargets: ''
    });

    const voiceQuestions = [
        { id: 'academic', question: "First, tell me about your current education. What is your current level, major, and GPA?", fields: ['level', 'degree', 'gpa'] },
        { id: 'goals', question: "Great! Now, what is your target degree and field of study? Which countries are you planning for?", fields: ['targetDegree', 'field', 'countries'] },
        { id: 'budget', question: "Understood. Finally, what is your annual budget for tuition and living expenses?", fields: ['budget'] }
    ];

    const speak = (text: string) => {
        const msg = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(msg);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            let current = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                current += event.results[i][0].transcript;
            }
            setTranscript(current);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current.start();
        setIsListening(true);
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const startVoiceInterview = () => {
        setIsVoiceActive(true);
        setVoiceStep(0);
        setTranscript('');
        speak(voiceQuestions[0].question);
        startListening();
    };

    const processVoiceStep = async () => {
        if (!transcript) return;
        stopListening();
        setIsParsing(true);

        // Build the current conversation segment
        const currentSegment = `Question: ${voiceQuestions[voiceStep].question}\nAnswer: ${transcript}\n\n`;
        const updatedFullConversation = fullConversation + currentSegment;
        setFullConversation(updatedFullConversation);

        try {
            const response = await fetch('/api/onboard-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: updatedFullConversation,
                    latestAnswer: transcript,
                    context: voiceQuestions[voiceStep].id
                })
            });

            if (response.ok) {
                const rawData = await response.json();
                console.log("=== AI RAW RESPONSE ===", rawData);

                const cleanData: any = {};

                // Process level - ALWAYS attempt to normalize
                if (rawData.level !== undefined && rawData.level !== null) {
                    const levelStr = rawData.level.toString().trim().toLowerCase();
                    console.log("[LEVEL] Raw:", rawData.level, "Processed:", levelStr);
                    if (levelStr) {
                        if (levelStr.includes('bachelor') || levelStr.includes('undergrad') || levelStr.includes('college') || levelStr.includes('bachelors')) {
                            cleanData.level = 'Bachelor';
                        } else if (levelStr.includes('master')) {
                            cleanData.level = 'Master';
                        } else if (levelStr.includes('high')) {
                            cleanData.level = 'High School';
                        } else if (levelStr !== '') {
                            cleanData.level = rawData.level;
                        }
                    }
                }

                // Process degree - ALWAYS set if present
                if (rawData.degree !== undefined && rawData.degree !== null) {
                    const degreeStr = rawData.degree.toString().trim();
                    console.log("[DEGREE] Raw:", rawData.degree, "Processed:", degreeStr);
                    if (degreeStr !== '') {
                        cleanData.degree = degreeStr;
                    }
                }

                // Process gpa - ALWAYS set if present
                if (rawData.gpa !== undefined && rawData.gpa !== null) {
                    const gpaStr = rawData.gpa.toString().trim();
                    console.log("[GPA] Raw:", rawData.gpa, "Processed:", gpaStr);
                    if (gpaStr !== '') {
                        cleanData.gpa = gpaStr;
                    }
                }

                // Process targetDegree - ALWAYS attempt to normalize
                if (rawData.targetDegree !== undefined && rawData.targetDegree !== null) {
                    const targetStr = rawData.targetDegree.toString().trim().toLowerCase();
                    console.log("[TARGET DEGREE] Raw:", rawData.targetDegree, "Processed:", targetStr);
                    if (targetStr) {
                        if (targetStr.includes('master')) {
                            cleanData.targetDegree = 'Master';
                        } else if (targetStr.includes('phd') || targetStr.includes('doctor')) {
                            cleanData.targetDegree = 'PhD';
                        } else if (targetStr.includes('bachelor')) {
                            cleanData.targetDegree = 'Bachelor';
                        } else if (targetStr.includes('mba')) {
                            cleanData.targetDegree = 'MBA';
                        } else if (targetStr !== '') {
                            cleanData.targetDegree = rawData.targetDegree;
                        }
                    }
                }

                // Process field - ALWAYS set if present
                if (rawData.field !== undefined && rawData.field !== null) {
                    const fieldStr = rawData.field.toString().trim();
                    console.log("[FIELD] Raw:", rawData.field, "Processed:", fieldStr);
                    if (fieldStr !== '') {
                        cleanData.field = fieldStr;
                    }
                }

                // Process countries - ALWAYS set if present
                if (rawData.countries !== undefined && rawData.countries !== null) {
                    const countriesStr = rawData.countries.toString().trim();
                    console.log("[COUNTRIES] Raw:", rawData.countries, "Processed:", countriesStr);
                    if (countriesStr !== '') {
                        cleanData.countries = countriesStr;
                    }
                }

                // Process budget - ALWAYS attempt to normalize
                if (rawData.budget !== undefined && rawData.budget !== null) {
                    const budgetStr = rawData.budget.toString().trim().toLowerCase();
                    console.log("[BUDGET] Raw:", rawData.budget, "Processed:", budgetStr);
                    if (budgetStr) {
                        if (budgetStr.includes('<20') || budgetStr.includes('less than 20') || budgetStr.includes('under 20') || budgetStr.includes('15') || budgetStr.includes('below 20')) {
                            cleanData.budget = '<20k';
                        } else if (budgetStr.includes('20') || budgetStr.includes('30') || budgetStr.includes('25') || budgetStr.includes('35')) {
                            cleanData.budget = '20k-40k';
                        } else if (budgetStr.includes('40') || budgetStr.includes('above') || budgetStr.includes('more than') || budgetStr.includes('50') || budgetStr.includes('60')) {
                            cleanData.budget = '40k+';
                        }
                    }
                }

                console.log("=== CLEANED DATA ===", cleanData);
                console.log("=== BEFORE UPDATE ===", formData);
                
                setFormData(prev => {
                    const updated = { ...prev, ...cleanData };
                    console.log("=== AFTER UPDATE ===", updated);
                    return updated;
                });

                if (voiceStep < voiceQuestions.length - 1) {
                    const next = voiceStep + 1;
                    setVoiceStep(next);
                    setTranscript('');
                    speak(voiceQuestions[next].question);
                    startListening();
                } else {
                    speak("Perfect! I've pre-filled your entire profile based on our conversation. Please review it now.");
                    setIsVoiceActive(false);
                    setStep(1);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsParsing(false);
        }
    };

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
                try {
                    const response = await fetch('/api/parse-cv', {
                        method: 'POST',
                        body: JSON.stringify({ fileBase64: base64, fileName: file.name, fileType: file.type })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("[CV Parse] Parsed data:", data);
                        setFormData(prev => ({ ...prev, ...data }));
                        setStep(1);
                    } else {
                        console.log("[CV Parse] CV parsing failed, proceeding with manual entry");
                        setStep(1);
                    }
                } catch (error) {
                    console.error("[CV Parse] Error:", error);
                    setStep(1);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setStep(1);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsParsing(true);

        try {
            // Generate or get user ID
            let userId = localStorage.getItem('userId');
            if (!userId) {
                userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('userId', userId);
            }

            console.log("[Onboarding] Saving profile for user:", userId);

            // Save to Turso
            const response = await fetch('/api/save-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    profileData: formData
                })
            });

            console.log("[Onboarding] Response status:", response.status, response.statusText);

            let responseData;
            try {
                responseData = await response.json();
            } catch (parseError) {
                console.error("[Onboarding] Failed to parse JSON response:", parseError);
                const text = await response.text();
                console.error("[Onboarding] Response text:", text);
                alert(`Server error (${response.status}): ${text || 'Unknown error'}`);
                setIsParsing(false);
                return;
            }

            console.log("[Onboarding] Response data:", responseData);

            if (!response.ok) {
                console.error("[Onboarding] Error response:", responseData);
                const errorMsg = responseData?.error || responseData?.message || 'Unknown error';
                console.error("[Onboarding] Error message:", errorMsg);
                alert(`Failed to save profile:\n${errorMsg}`);
                setIsParsing(false);
                return;
            }

            console.log("[Onboarding] Profile saved successfully!");

            // Store locally as backup
            localStorage.setItem('profile', JSON.stringify(formData));
            localStorage.setItem('onboardingComplete', 'true');

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (error: any) {
            console.error("[Onboarding] Exception:", error);
            alert(`An error occurred: ${error?.message || 'Unknown error'}`);
            setIsParsing(false);
        }
    };

    const renderStep = () => {
        if (isVoiceActive) {
            return (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: isListening ? 'pulse 1.5s infinite' : 'none' }}>🎙️</div>
                    <h3 style={{ marginBottom: '1rem' }}>{voiceQuestions[voiceStep].question}</h3>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        minHeight: '100px',
                        marginBottom: '2rem',
                        fontStyle: 'italic',
                        color: transcript ? 'white' : 'var(--text-muted)'
                    }}>
                        {transcript || "Listening..."}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn-secondary" onClick={() => setIsVoiceActive(false)}>Cancel</button>
                        <button className="btn-primary" onClick={processVoiceStep} disabled={isParsing}>
                            {isParsing ? "Processing..." : "Next Question"}
                        </button>
                    </div>
                </div>
            );
        }

        switch (step) {
            case 0:
                return (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Welcome to AI Counsellor</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="cv-upload-zone" style={{ border: '2px dashed var(--glass-border)', borderRadius: '16px', padding: '3rem 2rem', position: 'relative', cursor: 'pointer' }}>
                                <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={handleFileUpload} />
                                <div style={{ fontSize: '2rem' }}>📤</div>
                                <div style={{ fontWeight: 600 }}>Upload CV (PDF/DOCX)</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                                <span style={{ fontSize: '12px' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                            </div>
                            <button className="btn-secondary" onClick={() => setStep(1)}>Start Manually</button>
                            <button className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', background: 'rgba(99, 102, 241, 0.1)' }} onClick={startVoiceInterview}>
                                <div style={{ fontSize: '1.5rem' }}>🎙️</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600 }}>Interactive Voice Interview</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Talking is faster than typing!</div>
                                </div>
                            </button>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Academic Review</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Education Level</label>
                                <select className="glass-morph" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }}>
                                    <option value="">Select Level</option>
                                    <option value="High School">High School</option>
                                    <option value="Bachelor">Bachelor's</option>
                                    <option value="Master">Master's</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Major/Degree</label>
                                <input className="glass-morph" value={formData.degree} onChange={e => setFormData({ ...formData, degree: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }} placeholder="e.g. Computer Science" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GPA / Percentage</label>
                                <input className="glass-morph" value={formData.gpa} onChange={e => setFormData({ ...formData, gpa: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }} placeholder="e.g. 3.8/4.0, 8.5/10.0 or 85%" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in">
                        <h2 style={{ marginBottom: '1.5rem' }}>Goals & Budget</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Degree</label>
                                    <select className="glass-morph" value={formData.targetDegree} onChange={e => setFormData({ ...formData, targetDegree: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }}>
                                        <option value="">Select</option>
                                        <option value="Bachelor">Bachelor's</option>
                                        <option value="Master">Master's</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                                </div>
                                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Field</label>
                                    <input className="glass-morph" value={formData.field} onChange={e => setFormData({ ...formData, field: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }} placeholder="e.g. Artificial Intelligence" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Annual Budget</label>
                                <select className="glass-morph" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }}>
                                    <option value="">Select Range</option>
                                    <option value="<20k">Less than $20,000</option>
                                    <option value="20k-40k">$20,000 - $40,000</option>
                                    <option value="40k+">$40,000+</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target Countries</label>
                                <input className="glass-morph" value={formData.countries} onChange={e => setFormData({ ...formData, countries: e.target.value })} style={{ padding: '12px', borderRadius: '8px', color: 'white' }} placeholder="e.g. USA, UK, Germany" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <h2>Final Check</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You're all set! Review your details or complete your profile.</p>
                        <button className="btn-primary" onClick={() => setStep(1)}>Review Academic</button>
                        <button className="btn-primary" onClick={() => setStep(2)} style={{ marginLeft: '10px' }}>Review Goals</button>
                    </div>
                );
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                {loading ? (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading...</p>
                    </div>
                ) : (
                <div className="premium-card">
                    {renderStep()}
                    {!isVoiceActive && step > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary" onClick={prevStep}>Back</button>
                            {step < 2 ? (
                                <button className="btn-primary" onClick={nextStep}>Continue</button>
                            ) : (
                                <button className="btn-primary" onClick={handleSubmit}>Complete Profile</button>
                            )}
                        </div>
                    )}
                </div>
                )}
            </div>
        </main>
    );
}
