import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

// Initialize Turso client for fallback
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://aicounsellor-arnabnath1.aws-ap-northeast-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// Mock data for universities as last resort fallback
const MOCK_UNIVERSITIES = [
    { id: "uni-1", name: "Stanford University", country: "United States", cost: "High", ranking: 3, acceptanceRate: "Low" },
    { id: "uni-2", name: "University of Toronto", country: "Canada", cost: "Medium", ranking: 20, acceptanceRate: "Medium" },
    { id: "uni-3", name: "Technical University of Munich", country: "Germany", cost: "Low", ranking: 50, acceptanceRate: "Medium" },
    { id: "uni-4", name: "Arizona State University", country: "United States", cost: "Medium", ranking: 150, acceptanceRate: "High" },
    { id: "uni-5", name: "University of Oxford", country: "United Kingdom", cost: "High", ranking: 1, acceptanceRate: "Low" },
    { id: "uni-6", name: "University of Tokyo", country: "Japan", cost: "Low", ranking: 40, acceptanceRate: "Low" },
    { id: "uni-7", name: "Nanyang Technological University", country: "Singapore", cost: "Medium", ranking: 12, acceptanceRate: "Medium" },
    { id: "uni-8", name: "National University of Singapore", country: "Singapore", cost: "Medium", ranking: 8, acceptanceRate: "Medium" },
    { id: "uni-9", name: "University of Cambridge", country: "United Kingdom", cost: "High", ranking: 2, acceptanceRate: "Low" },
    { id: "uni-10", name: "Harvard University", country: "United States", cost: "High", ranking: 4, acceptanceRate: "Low" },
];

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const query = url.searchParams.get('query');

        console.log("[University Search API] Query:", query);

        if (!query || query.length < 2) {
            console.log("[University Search API] Query too short, returning empty");
            return NextResponse.json([]);
        }

        // Try HipoLabs API first (with detailed error logging)
        let hipolabsData: any[] | null = null;
        let hipolabsAttempted = false;
        try {
            hipolabsAttempted = true;
            console.log("[University Search API] Attempting HipoLabs API...");
            const encodedQuery = encodeURIComponent(query);
            const hipolabsUrl = `http://universities.hipolabs.com/search?name=${encodedQuery}`;
            console.log("[University Search API] HipoLabs URL:", hipolabsUrl);
            
            try {
                const response = await Promise.race([
                    fetch(hipolabsUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'AI-Counsellor/1.0'
                        }
                    }),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('HipoLabs request timeout')), 10000)
                    )
                ]) as Response;
                
                console.log("[University Search API] HipoLabs HTTP Status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("[University Search API] HipoLabs returned", data?.length || 0, "results");
                    
                    if (Array.isArray(data) && data.length > 0) {
                        // Format HipoLabs response
                        hipolabsData = data.slice(0, 15).map((uni: any) => ({
                            id: uni.name.replace(/\s+/g, '-').toLowerCase(),
                            name: uni.name,
                            country: uni.country,
                            domain: uni.web_pages?.[0] || null,
                            web_pages: uni.web_pages || [],
                            alpha_two_code: uni.alpha_two_code,
                            source: 'hipolabs'
                        }));
                        
                        console.log("[University Search API] Returning HipoLabs results");
                        return NextResponse.json(hipolabsData);
                    }
                } else {
                    console.log("[University Search API] HipoLabs HTTP Error:", response.status, response.statusText);
                }
            } catch (fetchErr: any) {
                console.log("[University Search API] HipoLabs Fetch Error:", fetchErr?.name, "-", fetchErr?.message);
            }
        } catch (hipolabsError: any) {
            console.log("[University Search API] HipoLabs Error:", hipolabsError?.message || "Unknown error");
        }

        // Fallback 1: Try Turso database
        try {
            console.log("[University Search API] Trying Turso database fallback...");
            const searchPattern = `%${query}%`;
            
            const result = await client.execute(
                `SELECT id, name, country, cost, ranking, acceptance_rate as acceptanceRate 
                 FROM universities 
                 WHERE name LIKE ? OR country LIKE ? 
                 LIMIT 10`,
                [searchPattern, searchPattern]
            );

            console.log("[University Search API] Turso database results:", result.rows.length);

            if (result.rows && result.rows.length > 0) {
                const formatted = result.rows.map((row: any) => ({
                    id: row.id,
                    name: row.name,
                    country: row.country,
                    cost: row.cost,
                    ranking: row.ranking,
                    acceptanceRate: row.acceptanceRate || row.acceptance_rate,
                    source: 'database'
                }));
                return NextResponse.json(formatted);
            }
        } catch (dbError: any) {
            console.log("[University Search API] Turso database error:", dbError?.message || "Unknown error");
        }

        // Fallback 2: Use mock data
        console.log("[University Search API] Using mock data fallback");
        const filtered = MOCK_UNIVERSITIES.filter(uni =>
            uni.name.toLowerCase().includes(query.toLowerCase()) ||
            uni.country.toLowerCase().includes(query.toLowerCase())
        );

        console.log("[University Search API] Mock results:", filtered.length);
        return NextResponse.json(filtered);

    } catch (error: any) {
        console.error("[University Search API] Unexpected error:", error?.message || error);
        return NextResponse.json([]);
    }
}
