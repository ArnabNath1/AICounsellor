import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://aicounsellor-arnabnath1.aws-ap-northeast-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk3ODQ4NzgsImlkIjoiYThjNmM5YWYtNmQxMy00N2Q3LTg2MmMtZGUyNjI0ZjA0MzgyIiwicmlkIjoiZTgyOTU1NTQtMmM2Yi00MTNmLWE4YTctYTc1NDU5NmI0ZGY1In0.Gi-L5-YGLTamkl4Pq3RafK2v5buDlrSeSLwrA3RdW2_LdLxD8bN_Ws6CjnDwsUDMEhk6az9QkRrn2X95mxleCw",
});

async function dropAndRecreateProfilesTable() {
  try {
    console.log("Dropping profiles table...");
    await client.execute("DROP TABLE IF EXISTS profiles");
    console.log("✓ Profiles table dropped");

    console.log("Creating profiles table...");
    await client.execute(`
      CREATE TABLE profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        level TEXT,
        degree TEXT,
        gpa TEXT,
        target_degree TEXT,
        field TEXT,
        intake TEXT,
        countries TEXT,
        budget TEXT,
        funding TEXT,
        ielts_score TEXT,
        gre_score TEXT,
        sop_status TEXT DEFAULT 'Not Started',
        research_interests TEXT,
        research_experience TEXT,
        skills TEXT,
        work_experience TEXT,
        certifications TEXT,
        extra_curriculars TEXT,
        projects TEXT,
        scholarship_targets TEXT,
        stage TEXT DEFAULT 'Onboarding'
      )
    `);
    console.log("✓ Profiles table created with nullable fields");

  } catch (error: any) {
    console.error("Error:", error?.message || error);
    process.exit(1);
  }
}

dropAndRecreateProfilesTable();
