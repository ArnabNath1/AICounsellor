"use client";
import { useState, useEffect, useRef } from 'react';

export default function AICounsellor() {
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: "Hello! I've analyzed your profile. You have a solid academic background. Based on your goal for a Master's in CS in the USA, I recommend we start looking at 'Target' and 'Dream' universities. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (customMessage?: string) => {
        const messageText = customMessage || input;
        if (!messageText.trim() || loading) return;

        const userMessage = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        if (!customMessage) setInput('');
        setLoading(true);

        try {
            const profile = JSON.parse(localStorage.getItem('profile') || '{}');
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage], profile }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: errorData.error || "I'm having trouble connecting right now." }]);
                setLoading(false);
                return;
            }

            // Create a temporary message for the stream
            setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error("No reader found");

            let accumulatedText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                // Update the last message (the one we just added) with the new text
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'assistant', content: accumulatedText };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Dynamic AI Counsellor</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time guidance and decision support.</p>
            </header>

            <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                {/* Messages Pool */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((m, idx) => (
                        <div key={idx} style={{
                            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            padding: '1rem 1.5rem',
                            borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            border: m.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap'
                        }}>
                            {m.content}
                        </div>
                    ))}
                    {loading && messages[messages.length - 1].content === "" && (
                        <div style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--text-muted)' }}>
                            Thinking...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            className="glass-morph"
                            style={{ flex: 1, padding: '14px 20px', borderRadius: '14px', color: 'white', border: '1px solid var(--glass-border)' }}
                            placeholder="Ask about universities, risks, or next steps..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button className="btn-primary" onClick={() => handleSend()} disabled={loading}>
                            Send
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleSend("Can you recommend some universities based on my profile?")}>Recommend Universities</button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleSend("Based on my target universities, what are the gaps in my profile?")}>Explain My Gaps</button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => handleSend("What should be my next step in this journey?")}>What's my next step?</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
