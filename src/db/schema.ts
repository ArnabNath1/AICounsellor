import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),

  // Academic
  level: text('level').notNull(),
  degree: text('degree').notNull(),
  gpa: text('gpa').notNull(),

  // Goals
  targetDegree: text('target_degree').notNull(),
  field: text('field').notNull(),
  intake: text('intake').notNull(),
  countries: text('countries').notNull(),

  // Budget
  budget: text('budget').notNull(),
  funding: text('funding').notNull(),

  // Readiness
  ieltsScore: text('ielts_score'),
  greScore: text('gre_score'),
  sopStatus: text('sop_status').notNull(), // "Not Started", "Draft", "Ready"

  // Holistic Profile
  researchInterests: text('research_interests'),
  researchExperience: text('research_experience'),
  skills: text('skills'),
  workExperience: text('work_experience'),
  certifications: text('certifications'),
  extraCurriculars: text('extra_curriculars'),
  projects: text('projects'),
  scholarshipTargets: text('scholarship_targets'),

  stage: text('stage').notNull().default('Onboarding'), // Onboarding, Discovery, Shortlisting, Locked, Application
});

export const universities = sqliteTable('universities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  cost: text('cost').notNull(),
  ranking: integer('ranking'),
  acceptanceRate: text('acceptance_rate'), // "High", "Medium", "Low"
});

export const shortlists = sqliteTable('shortlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  universityId: text('university_id').notNull().references(() => universities.id),

  category: text('category').notNull(), // "Dream", "Target", "Safe"
  status: text('status').notNull().default('Shortlisted'), // "Shortlisted", "Locked"

  notes: text('notes'),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),

  title: text('title').notNull(),
  status: text('status').notNull().default('Pending'), // "Pending", "Completed"
  category: text('category'),
});
