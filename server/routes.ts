import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, insertUserSchema } from "@shared/schema";
import { improveResumeText, generateProfessionalSummary, analyzeResumeForATS, getSuggestions } from "./services/huggingface";
import { chatWithAI, getSectionAdvice, getCareerAdvice } from "./services/ai-chat";
export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Resume routes
  app.get("/api/resumes/user/:userId", async (req, res) => {
    try {
      const resumes = await storage.getResumesByUserId(req.params.userId);
      res.json(resumes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.json(resume);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const resumeData = insertResumeSchema.partial().parse(req.body);
      const resume = await storage.updateResume(req.params.id, resumeData);
      res.json(resume);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      await storage.deleteResume(req.params.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Enhancement routes
  app.post("/api/ai/improve-text", async (req, res) => {
    try {
      const { text, context, jobDescription } = req.body;
      
      if (!text || !context) {
        return res.status(400).json({ message: "Text and context are required" });
      }

      const improvedText = await improveResumeText(text, context, jobDescription);
      res.json({ improvedText });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-summary", async (req, res) => {
    try {
      const { personalInfo, experience, skills, jobDescription } = req.body;
      
      if (!personalInfo || !experience || !skills) {
        return res.status(400).json({ message: "Personal info, experience, and skills are required" });
      }

      const summary = await generateProfessionalSummary(personalInfo, experience, skills, jobDescription);
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/analyze-ats", async (req, res) => {
    try {
      const { resumeData } = req.body;
      
      if (!resumeData) {
        return res.status(400).json({ message: "Resume data is required" });
      }

      const analysis = await analyzeResumeForATS(resumeData);
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const { resumeData, section } = req.body;
      
      if (!resumeData || !section) {
        return res.status(400).json({ message: "Resume data and section are required" });
      }

      const suggestions = await getSuggestions(resumeData, section);
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, resumeData, conversationHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await chatWithAI(message, resumeData, conversationHistory);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/chat/section-advice", async (req, res) => {
    try {
      const { section, content } = req.body;
      
      if (!section || !content) {
        return res.status(400).json({ message: "Section and content are required" });
      }

      const response = await getSectionAdvice(section, content);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/chat/career-advice", async (req, res) => {
    try {
      const { jobTitle, experience } = req.body;
      
      if (!jobTitle) {
        return res.status(400).json({ message: "Job title is required" });
      }

      const response = await getCareerAdvice(jobTitle, experience || []);
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
