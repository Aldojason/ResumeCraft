import { 
  users, 
  resumes, 
  type User, 
  type InsertUser, 
  type Resume, 
  type InsertResume 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume methods
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values(insertResume)
      .returning();
    return resume;
  }

  async updateResume(id: string, updateData: Partial<InsertResume>): Promise<Resume> {
    const [resume] = await db
      .update(resumes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }
}

export const storage = new DatabaseStorage();
