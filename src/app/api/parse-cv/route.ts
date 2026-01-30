import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { fileBase64, fileName, fileType } = formData;

        if (!fileBase64) {
            return NextResponse.json({ error: "No CV data provided" }, { status: 400 });
        }

        // Check if API key is available
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            console.warn("[Parse CV] Google API key not configured, returning template");
            return NextResponse.json({
                level: "",
                degree: "",
                gpa: "",
                targetDegree: "",
                field: "",
                researchInterests: "",
                researchExperience: "",
                skills: "",
                workExperience: "",
                certifications: "",
                extraCurriculars: "",
                projects: "",
                note: "CV parsing requires GOOGLE_GENAI_API_KEY. Please add it to .env.local"
            });
        }

        // Using 2.5-flash for stable production parsing
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
            You are an expert CV Parser. Extract information from this academic CV and return it in a strictly valid JSON format.
            If a field is not found, return an empty string.

            Expected JSON Structure:
            {
                "level": "High School" | "Bachelor" | "Master",
                "degree": "Extracted Major/Degree name",
                "gpa": "Extracted GPA",
                "targetDegree": "Suggested next degree based on current (e.g. Master if current is Bachelor)",
                "field": "Field of study (e.g. Computer Science)",
                "researchInterests": "Comma separated interests",
                "researchExperience": "Summary of research experience",
                "skills": "Comma separated skills",
                "workExperience": "Summary of work experience",
                "certifications": "Comma separated certifications",
                "extraCurriculars": "Hackathons, sports, or volunteering",
                "projects": "Summary of key projects"
            }

            STRICT RULES:
            - Return ONLY valid JSON
            - All values must be strings
            - If not found, use empty string ""
            - For level, use exactly: "High School", "Bachelor", or "Master"
        `;

        console.log("[Parse CV] Processing file:", fileName);

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: fileBase64,
                                mimeType: fileType || "application/pdf"
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const response = await result.response;
        const text = response.text();

        console.log("[Parse CV] Raw response:", text);

        try {
            const parsedData = JSON.parse(text);
            console.log("[Parse CV] Successfully parsed CV");
            return NextResponse.json(parsedData);
        } catch (jsonError) {
            console.error("[Parse CV] JSON Parse Error:", jsonError, text);
            
            // Try to extract JSON from response if it contains other text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    console.log("[Parse CV] Extracted JSON from response");
                    return NextResponse.json(extracted);
                } catch (e) {
                    console.error("[Parse CV] Extraction failed:", e);
                }
            }
            
            return NextResponse.json({ 
                error: "Failed to parse CV. Please fill your profile manually.",
                level: "",
                degree: "",
                gpa: "",
                targetDegree: "",
                field: "",
                researchInterests: "",
                researchExperience: "",
                skills: "",
                workExperience: "",
                certifications: "",
                extraCurriculars: "",
                projects: ""
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[Parse CV] Error:", error?.message || error);
        return NextResponse.json({ 
            error: error?.message || "Failed to parse CV. Please fill your profile manually.",
            level: "",
            degree: "",
            gpa: "",
            targetDegree: "",
            field: "",
            researchInterests: "",
            researchExperience: "",
            skills: "",
            workExperience: "",
            certifications: "",
            extraCurriculars: "",
            projects: ""
        }, { status: 500 });
    }
}
