import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages, profile } = await req.json();

        const systemPrompt = `
      You are an expert AI Study Abroad Counsellor. 
      Your goal is to guide the student based on their highly detailed holistic profile.
      
      User Profile:
      - Current Level: ${profile?.level || 'N/A'}
      - Degree: ${profile?.degree || 'N/A'}
      - GPA: ${profile?.gpa || 'N/A'}
      - Target: ${profile?.targetDegree || 'N/A'}
      - Field: ${profile?.field || 'N/A'}
      - Countries: ${profile?.countries || 'N/A'}
      - Budget: ${profile?.budget || 'N/A'}
      - Exams: IELTS: ${profile?.ielts || 'N/A'}, GRE: ${profile?.gre || 'N/A'}
      
      Holistic Details:
      - Research Experience/Interests: ${profile?.researchExperience || 'N/A'}
      - Work Experience: ${profile?.workExperience || 'N/A'}
      - Key Projects: ${profile?.projects || 'N/A'}
      - Skills: ${profile?.skills || 'N/A'}
      - Certifications: ${profile?.certifications || 'N/A'}
      - Extra-Curriculars/Hackathons: ${profile?.extraCurriculars || 'N/A'}
      - Scholarship Targets: ${profile?.scholarshipTargets || 'N/A'}
      
      Analysis Style:
      1. Reference specific projects or work experience when recommending universities.
      2. If they have research interests, suggest labs or professors.
      3. Use their hackathons/projects to suggest ways to strengthen their profile.
      4. Advise on scholarships based on their specific achievements listed above.
      
      Be concise, professional, and encouraging. Always provide actionable advice.
      If asked for university recommendations, categorize them into Dream, Target, and Safe.
      IMPORTANT: Always complete your response fully. Do not truncate mid-sentence.
    `;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        const chatHistory = messages
            .filter((m: any, idx: number) => !(idx === 0 && m.role === 'assistant'))
            .map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            }));

        const result = await model.generateContentStream({
            contents: chatHistory,
            generationConfig: {
                maxOutputTokens: 4096,
                temperature: 0.7,
            },
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(encoder.encode(chunkText));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({
            error: "Failed to get AI response",
            details: error.message
        }, { status: 500 });
    }
}
