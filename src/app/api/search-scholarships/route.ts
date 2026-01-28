import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyCRvABaDhsySl0e3NGKq1BaGZs_YYmw3Kc");

export async function POST(req: Request) {
    try {
        const { query, profile } = await req.json();

        // Using 1.5-flash for stable production parsing
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
            You are a real-time Scholarship Search Engine. Find ACTUAL, CURRENT scholarships available for international students based on the query: "${query}".
            
            Use your internal knowledge and search capabilities to find real programs like:
            - Country-specific grants (DAAD, Chevening, Fulbright, MEXT)
            - University-specific excellence awards
            - Private foundation scholarships (Gates, Tata, Mastercard Foundation)

            User Profile Context to tailor the search:
            - Level: ${profile?.level || 'N/A'}
            - Field: ${profile?.field || 'N/A'}
            - GPA: ${profile?.gpa || 'N/A'}
            - Research: ${profile?.researchExperience || 'N/A'}

            Return the results in a strictly valid JSON array of objects:
            [
                {
                    "id": number,
                    "name": "Full Name of Scholarship",
                    "provider": "Organization or University Name",
                    "amount": "Approximate value (e.g., Full Tuition, $10,000)",
                    "deadline": "Current or typical deadline",
                    "match": number (1-100),
                    "reason": "Specific reason why this fits the user's criteria",
                    "link": "The official website URL (VERY IMPORTANT)"
                }
            ]

            Only return the JSON. No conversational text.
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const response = await result.response;
        const text = response.text();

        try {
            const parsedData = JSON.parse(text);
            return NextResponse.json(parsedData);
        } catch (jsonError) {
            console.error("Scholarship Search JSON Error:", jsonError, text);
            return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Scholarship Search Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
