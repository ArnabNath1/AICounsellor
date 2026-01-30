import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { userId, profileData } = await req.json();

        if (!userId || !profileData) {
            console.error("[Save Profile] Missing userId or profileData");
            return NextResponse.json({ error: "Missing userId or profileData" }, { status: 400 });
        }

        console.log("[Save Profile] Saving profile for user:", userId);
        console.log("[Save Profile] Profile data keys:", Object.keys(profileData));

        // Prepare the data to save
        const dataToSave = {
            id: `profile-${userId}-${Date.now()}`,
            userId: userId,
            level: profileData.level?.trim() || null,
            degree: profileData.degree?.trim() || null,
            gpa: profileData.gpa?.trim() || null,
            targetDegree: profileData.targetDegree?.trim() || null,
            field: profileData.field?.trim() || null,
            intake: profileData.intake?.trim() || null,
            countries: profileData.countries?.trim() || null,
            budget: profileData.budget?.trim() || null,
            funding: profileData.funding?.trim() || null,
            ieltsScore: profileData.ielts?.trim() || null,
            greScore: profileData.gre?.trim() || null,
            sopStatus: profileData.sop?.trim() || "Not Started",
            researchInterests: profileData.researchInterests?.trim() || null,
            researchExperience: profileData.researchExperience?.trim() || null,
            skills: profileData.skills?.trim() || null,
            workExperience: profileData.workExperience?.trim() || null,
            certifications: profileData.certifications?.trim() || null,
            extraCurriculars: profileData.extraCurriculars?.trim() || null,
            projects: profileData.projects?.trim() || null,
            scholarshipTargets: profileData.scholarshipTargets?.trim() || null,
            stage: "Onboarding",
        };

        console.log("[Save Profile] Data to save:", dataToSave);

        // Check if profile already exists
        let existingProfile;
        try {
            existingProfile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
            console.log("[Save Profile] Existing profile found:", existingProfile.length > 0);
        } catch (checkError: any) {
            console.warn("[Save Profile] Error checking existing profile:", checkError?.message);
            existingProfile = [];
        }

        let result;

        try {
            if (existingProfile.length > 0) {
                console.log("[Save Profile] Updating existing profile");
                result = await db.update(profiles)
                    .set(dataToSave)
                    .where(eq(profiles.userId, userId))
                    .returning();
                console.log("[Save Profile] Update successful, rows affected:", result.length);
            } else {
                console.log("[Save Profile] Creating new profile");
                result = await db.insert(profiles).values(dataToSave).returning();
                console.log("[Save Profile] Insert successful, rows created:", result.length);
            }
        } catch (dbError: any) {
            console.error("[Save Profile] Database error:", dbError?.message);
            console.error("[Save Profile] Error details:", dbError);
            return NextResponse.json({ 
                error: "Database error: " + (dbError?.message || "Unknown error"),
                hint: "Check server logs for details"
            }, { status: 500 });
        }

        console.log("[Save Profile] Success!");
        return NextResponse.json({
            success: true,
            message: "Profile saved successfully",
            data: result
        });

    } catch (error: any) {
        console.error("[Save Profile] Unexpected error:", error?.message || error);
        console.error("[Save Profile] Full error:", error);
        return NextResponse.json({ 
            error: error?.message || "Failed to save profile",
            hint: "Check server logs for details"
        }, { status: 500 });
    }
}

