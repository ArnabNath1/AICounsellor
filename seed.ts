import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { universities } from './src/db/schema';
import { v4 as uuidv4 } from 'uuid';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

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
    console.log("Seeding universities...");
    for (const uni of universityData) {
        await db.insert(universities).values(uni).run();
    }
    console.log("Seeding completed.");
}

seed().catch(console.error);
