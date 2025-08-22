import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  personalInfo: json("personal_info").notNull(),
  experience: json("experience").notNull(),
  education: json("education").notNull(),
  skills: json("skills").notNull(),
  projects: json("projects").notNull(),
  certifications: json("certifications").notNull(),
  achievements: json("achievements").notNull(),
  template: text("template").notNull().default("modern"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const personalInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  linkedin: z.string().url().optional(),
  website: z.string().url().optional(),
  photo: z.string().optional(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  position: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  location: z.string(),
  description: z.array(z.string()),
});

export const educationItemSchema = z.object({
  id: z.string(),
  degree: z.string().min(1),
  institution: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string(),
  gpa: z.string().optional(),
  description: z.array(z.string()).optional(),
});

export const skillCategorySchema = z.object({
  category: z.string().min(1),
  skills: z.array(z.string()),
});

export const projectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
});

export const achievementItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skills: z.array(skillCategorySchema),
  projects: z.array(projectItemSchema),
  certifications: z.array(certificationItemSchema),
  achievements: z.array(achievementItemSchema),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type AchievementItem = z.infer<typeof achievementItemSchema>;
