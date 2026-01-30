import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://aicounsellor-arnabnath1.aws-ap-northeast-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk3ODQ4NzgsImlkIjoiYThjNmM5YWYtNmQxMy00N2Q3LTg2MmMtZGUyNjI0ZjA0MzgyIiwicmlkIjoiZTgyOTU1NTQtMmM2Yi00MTNmLWE4YTctYTc1NDU5NmI0ZGY1In0.Gi-L5-YGLTamkl4Pq3RafK2v5buDlrSeSLwrA3RdW2_LdLxD8bN_Ws6CjnDwsUDMEhk6az9QkRrn2X95mxleCw",
});

async function initializeDatabase() {
  try {
    console.log("Creating tables...");

    // Create users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Users table created");

    // Create profiles table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
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
        stage TEXT DEFAULT 'Onboarding',
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log("✓ Profiles table created");

    // Create universities table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS universities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        cost TEXT,
        ranking INTEGER,
        acceptance_rate TEXT
      )
    `);
    console.log("✓ Universities table created");

    // Create shortlists table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS shortlists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        university_id TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'Shortlisted',
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (university_id) REFERENCES universities(id)
      )
    `);
    console.log("✓ Shortlists table created");

    // Create tasks table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        category TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log("✓ Tasks table created");

    console.log("\n✓ All tables created successfully!");
  } catch (error: any) {
    console.error("Error creating tables:", error?.message || error);
    process.exit(1);
  }
}

initializeDatabase();
