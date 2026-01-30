import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { universities } from './src/db/schema';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://aicounsellor-arnabnath1.aws-ap-northeast-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk3ODQ4NzgsImlkIjoiYThjNmM5YWYtNmQxMy00N2Q3LTg2MmMtZGUyNjI0ZjA0MzgyIiwicmlkIjoiZTgyOTU1NTQtMmM2Yi00MTNmLWE4YTctYTc1NDU5NmI0ZGY1In0.Gi-L5-YGLTamkl4Pq3RafK2v5buDlrSeSLwrA3RdW2_LdLxD8bN_Ws6CjnDwsUDMEhk6az9QkRrn2X95mxleCw',
});

const db = drizzle(client, { schema: { universities } });

const universityData = [
    {
        id: uuidv4(),
        name: "Stanford University",
        country: "USA",
        cost: "High",
        ranking: 3,
        acceptanceRate: "Low",
    },
    {
        id: uuidv4(),
        name: "University of Toronto",
        country: "Canada",
        cost: "Medium",
        ranking: 20,
        acceptanceRate: "Medium",
    },
    {
        id: uuidv4(),
        name: "Technical University of Munich",
        country: "Germany",
        cost: "Low",
        ranking: 50,
        acceptanceRate: "Medium",
    },
    {
        id: uuidv4(),
        name: "Arizona State University",
        country: "USA",
        cost: "Medium",
        ranking: 150,
        acceptanceRate: "High",
    },
    {
        id: uuidv4(),
        name: "University of Oxford",
        country: "UK",
        cost: "High",
        ranking: 1,
        acceptanceRate: "Low",
    },
];

async function seed() {
    console.log("Seeding universities to Turso...");
    try {
        for (const uni of universityData) {
            await db.insert(universities).values(uni);
        }
        console.log("✅ Seeding completed successfully.");
    } catch (error) {
        console.error("❌ Seeding error:", error);
    }
}

seed().catch(console.error);
