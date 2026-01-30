import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { transcript, latestAnswer, context } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        console.log(`[Voice Onboard] Starting RAG-Extraction for: ${context}`);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        // TECHNIQUE: Multi-Pass Semantic Retrieval
        // Pass 1: Segment & Index (The AI 'stores' knowledge in its reasoning)
        // Pass 2: Targeted Query Retrieval
        const prompt = `
            ROLE: You are an expert data extraction bot for educational profiling.
            
            TRANSCRIPT:
            ${transcript}

            ========================================
            YOUR TASK: Extract EXACTLY these 7 fields from the transcript above:
            ========================================

            FIELD DEFINITIONS:
            - level: What is the user's CURRENT education level? (High School | Bachelor | Master)
            - degree: What is the user's CURRENT major or degree name? (e.g., Computer Science, Engineering, etc.)
            - gpa: What is the user's CURRENT GPA or percentage? (e.g., 3.8, 8.5/10, 85%)
            - targetDegree: What degree does the user WANT to pursue? (Bachelor | Master | PhD | MBA)
            - field: What is the user's TARGET field of study? (e.g., AI, Data Science, Finance, etc.)
            - countries: Where does the user want to study? (e.g., USA, UK, Japan, Singapore)
            - budget: What is the user's annual budget? (<20k | 20k-40k | 40k+)

            ========================================
            EXTRACTION EXAMPLES:
            ========================================

            EXAMPLE 1:
            Transcript: "I'm currently doing my bachelor's in Computer Science. I have a GPA of 3.8 out of 4. I want to do a master's in Artificial Intelligence in the USA."
            Output: {
                "level": "Bachelor",
                "degree": "Computer Science",
                "gpa": "3.8",
                "targetDegree": "Master",
                "field": "Artificial Intelligence",
                "countries": "USA",
                "budget": ""
            }

            EXAMPLE 2:
            Transcript: "I completed high school with 90%. Now I want to pursue a bachelor's degree in Business Administration in Canada or UK. My budget is around 25k per year."
            Output: {
                "level": "High School",
                "degree": "High School",
                "gpa": "90%",
                "targetDegree": "Bachelor",
                "field": "Business Administration",
                "countries": "Canada, UK",
                "budget": "20k-40k"
            }

            EXAMPLE 3:
            Transcript: "I'm currently a Master's student in Engineering. My current GPA is 8.5 out of 10. I want to pursue a PhD in Machine Learning in the USA, Canada, or Singapore. My budget is 50k per year."
            Output: {
                "level": "Master",
                "degree": "Engineering",
                "gpa": "8.5",
                "targetDegree": "PhD",
                "field": "Machine Learning",
                "countries": "USA, Canada, Singapore",
                "budget": "40k+"
            }

            ========================================
            STRICT RULES FOR OUTPUT:
            ========================================
            1. Return ONLY a valid JSON object with exactly these 7 fields
            2. For "level" and "targetDegree" use ONLY these exact values: High School, Bachelor, Master, PhD, MBA
            3. For "budget" use ONLY these exact values: <20k, 20k-40k, 40k+
            4. If a field is NOT mentioned in the transcript, use empty string ""
            5. Extract EXACTLY what the user said, don't invent information
            6. Look for keywords: bachelor/bachelors, master/masters, high school, phd, mba, gpa, percentage, %, study, pursue, want, current, degree, major, field, country, budget, annual, per year
            7. Return ONLY valid JSON, no other text
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const response = await result.response;
        const text = response.text();
        
        console.log("[Voice Onboard] Raw AI Response:", text);

        try {
            let parsedData = JSON.parse(text);
            
            // Ensure all expected fields exist
            const expectedFields = ['level', 'degree', 'gpa', 'targetDegree', 'field', 'countries', 'budget'];
            expectedFields.forEach(field => {
                if (!(field in parsedData)) {
                    parsedData[field] = '';
                }
                // Ensure values are strings, not null
                if (parsedData[field] === null || parsedData[field] === undefined) {
                    parsedData[field] = '';
                }
            });
            
            console.log("[Voice Onboard] Parsed Data:", parsedData);
            return NextResponse.json(parsedData);
        } catch (jsonError) {
            console.error("JSON Parse Error:", jsonError, text);
            
            // Try to extract JSON from the response if it contains other text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const extractedData = JSON.parse(jsonMatch[0]);
                    console.log("[Voice Onboard] Extracted JSON:", extractedData);
                    return NextResponse.json(extractedData);
                } catch (e) {
                    console.error("Extraction failed:", e);
                }
            }
            
            return NextResponse.json({ error: "Invalid JSON from AI", raw: text }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Voice Onboard Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
