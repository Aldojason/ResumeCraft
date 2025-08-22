import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { AIAssistant } from "@/components/ai-assistant";
import { AIChat } from "@/components/ai-chat";
import { TemplateSelector } from "@/components/template-selector";
import { useTheme } from "@/components/theme-provider";
import { useCreateResume, useUpdateResume } from "@/hooks/use-resume";
import { FileText, Moon, Sun, Sparkles, Download } from "lucide-react";
import { type InsertResume } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const initialResumeData: InsertResume = {
  userId: "demo-user", // In a real app, this would come from authentication
  title: "My Resume",
  template: "modern",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    title: "Software Engineer",
    summary: "Experienced software engineer with a passion for building scalable applications.",
    linkedin: "https://linkedin.com/in/johndoe",
  },
  experience: [{
    id: "1",
    position: "Software Engineer",
    company: "Tech Corp",
    startDate: "2023-01",
    endDate: "",
    current: true,
    location: "New York, NY",
    description: ["Developed full-stack web applications", "Collaborated with cross-functional teams"],
  }],
  education: [{
    id: "1",
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Technology",
    startDate: "2019-09",
    endDate: "2023-05",
    location: "New York, NY",
    gpa: "3.8",
    description: ["Relevant coursework: Data Structures, Algorithms, Web Development"],
  }],
  skills: [{
    category: "Programming Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java"]
  }],
  projects: [{
    id: "1",
    name: "E-commerce Platform",
    description: "Built a full-stack e-commerce application",
    technologies: ["React", "Node.js", "PostgreSQL"],
    url: "https://github.com/johndoe/ecommerce",
    github: "https://github.com/johndoe/ecommerce",
    startDate: "2023-03",
    endDate: "2023-06",
  }],
  certifications: [{
    id: "1",
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023-08",
    expirationDate: "2026-08",
    credentialId: "AWS-DEV-12345",
    url: "https://aws.amazon.com/certification/",
  }],
  achievements: [{
    id: "1",
    title: "Best Developer Award",
    description: "Recognized for outstanding contributions to team projects",
    date: "2023-12",
  }],
};

export default function Home() {
  const [resumeData, setResumeData] = useState<InsertResume>(initialResumeData);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  // Auto-save when resume data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentResumeId) {
        updateResume.mutate({ id: currentResumeId, data: resumeData });
      } else if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName && resumeData.personalInfo.email) {
        // Create new resume if we have basic info and valid data
        createResume.mutate(resumeData, {
          onSuccess: (data) => {
            setCurrentResumeId(data.id);
          },
        });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [resumeData, currentResumeId, createResume, updateResume]);

  const handleDataChange = (data: Partial<InsertResume>) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  const handleTemplateChange = (templateId: string) => {
    setResumeData(prev => ({ ...prev, template: templateId }));
  };

  const handleApplySuggestion = (suggestion: any) => {
    if (suggestion.section === "personalInfo" && suggestion.field === "summary") {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: suggestion.suggestedText || prev.personalInfo.summary,
        },
      }));
    }
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to your resume.",
    });
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 7; // Total sections

    if (resumeData.personalInfo.firstName && resumeData.personalInfo.lastName) completed++;
    if (resumeData.personalInfo.summary) completed++;
    if (resumeData.experience.length > 0) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.projects.length > 0) completed++;
    if (resumeData.certifications.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-white text-xs sm:text-sm" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Resume Builder</h1>
            </div>

            {/* Navigation and Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Progress - Hidden on mobile, shown on tablet+ */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="hidden md:inline">Progress:</span>
                <div className="w-16 md:w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage()}%` }}
                  ></div>
                </div>
                <span className="hidden md:inline">{completionPercentage()}%</span>
              </div>

              {/* Templates Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTemplateOpen(true)}
                data-testid="button-open-template-selector"
                className="hidden sm:flex"
              >
                <span className="hidden md:inline">Templates</span>
              </Button>

              {/* AI Assistant Button */}
              <Button
                onClick={() => setIsAIOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-xs sm:text-sm"
                data-testid="button-open-ai-assistant"
                size="sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                data-testid="button-toggle-theme"
              >
                {theme === "light" ? (
                  <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Application */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Resume Form */}
        <ResumeForm
          resumeData={resumeData}
          onDataChange={handleDataChange}
          resumeId={currentResumeId}
          className="w-full lg:w-1/2 h-full lg:h-auto lg:min-h-0"
        />

        {/* Resume Preview */}
        <ResumePreview
          resumeData={resumeData}
          template={resumeData.template}
          onTemplateChange={handleTemplateChange}
          onOpenTemplateSelector={() => setIsTemplateOpen(true)}
          className="w-full lg:w-1/2 h-full lg:h-auto lg:min-h-0"
        />
      </div>

      {/* AI Assistant Panel */}
      <AIAssistant
        resumeData={resumeData}
        onApplySuggestion={handleApplySuggestion}
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        currentTemplate={resumeData.template}
        onSelectTemplate={handleTemplateChange}
      />

      {/* AI Chat Assistant */}
      <AIChat resumeData={resumeData} />
    </div>
  );
}
