import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyCRvABaDhsySl0e3NGKq1BaGZs_YYmw3Kc");

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { fileBase64, fileName, fileType } = formData;

        if (!fileBase64) {
            return NextResponse.json({ error: "No CV data provided" }, { status: 400 });
        }

        // Reverting to 1.5-flash which is confirmed to work and exists
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
        `;

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

        try {
            const parsedData = JSON.parse(text);
            return NextResponse.json(parsedData);
        } catch (jsonError) {
            console.error("JSON Parse Error:", jsonError, text);
            return NextResponse.json({ error: "Invalid JSON from AI", raw: text }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Parse CV Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
