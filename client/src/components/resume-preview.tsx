import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoomIn, ZoomOut, Download, Layers } from "lucide-react";
import { type Resume, type InsertResume } from "@shared/schema";
import { getTemplateStyles } from "@/lib/templates";
import { exportToPDF } from "@/lib/pdf-export";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  resumeData: InsertResume;
  template: string;
  onTemplateChange: (templateId: string) => void;
  onOpenTemplateSelector: () => void;
  className?: string;
}

export function ResumePreview({ 
  resumeData, 
  template, 
  onTemplateChange, 
  onOpenTemplateSelector, 
  className 
}: ResumePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  // ATS Analysis Query
  const { data: atsAnalysis, isLoading: atsLoading } = useQuery({
    queryKey: ["/api/ai/analyze-ats", resumeData],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/analyze-ats", { resumeData });
      return response.json();
    },
    enabled: !!resumeData.personalInfo.firstName,
  });

  const handleExportPDF = async () => {
    try {
      const mockResume: Resume = {
        ...resumeData,
        id: "temp",
        userId: "temp",
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
      };
      await exportToPDF(mockResume);
      toast({
        title: "PDF Exported",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const templateStyles = getTemplateStyles(template);

  return (
    <div className={cn("bg-gray-50 dark:bg-gray-900 overflow-y-auto", className)}>
      <div className="p-3 sm:p-4 xl:p-6">
        {/* Controls */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Live Preview</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Template Selector */}
              <Select value={template} onValueChange={onTemplateChange}>
                <SelectTrigger className="w-28 sm:w-36 xl:w-40" data-testid="select-template">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern Template</SelectItem>
                  <SelectItem value="classic">Classic Template</SelectItem>
                  <SelectItem value="creative">Creative Template</SelectItem>
                  <SelectItem value="minimal">Minimal Template</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenTemplateSelector}
                data-testid="button-open-templates"
                className="hidden md:flex"
              >
                <Layers className="w-4 h-4 mr-2" />
                Templates
              </Button>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  data-testid="button-zoom-out"
                >
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 border-x border-gray-300 dark:border-gray-600">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 150}
                  data-testid="button-zoom-in"
                >
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              {/* Export Button */}
              <Button onClick={handleExportPDF} data-testid="button-export-pdf" size="sm" className="text-xs sm:text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Resume Preview Document */}
        <div 
          className="transition-transform origin-top preview-area tablet-preview-area"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <div className={cn(templateStyles.container, "w-full max-w-4xl mx-auto px-3 sm:px-0")}>
            {/* Header */}
            <div className={templateStyles.header}>
              {resumeData.template === "executive" ? (
                // Executive template - centered layout
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2 text-inherit">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <p className="text-xl mb-4 text-inherit opacity-90">
                    {resumeData.personalInfo.title}
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-inherit opacity-80">
                    {resumeData.personalInfo.email && (
                      <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.location && (
                      <span>{resumeData.personalInfo.location}</span>
                    )}
                  </div>
                  {resumeData.personalInfo.linkedin && (
                    <div className="mt-3 text-sm text-inherit opacity-80">
                      {resumeData.personalInfo.linkedin}
                    </div>
                  )}
                </div>
              ) : resumeData.template === "tech" ? (
                // Tech template - left-aligned with icon
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1 text-inherit">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <p className="text-lg mb-3 text-inherit">
                      {resumeData.personalInfo.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-inherit">
                      {resumeData.personalInfo.email && (
                        <span>📧 {resumeData.personalInfo.email}</span>
                      )}
                      {resumeData.personalInfo.phone && (
                        <span>📱 {resumeData.personalInfo.phone}</span>
                      )}
                      {resumeData.personalInfo.location && (
                        <span>📍 {resumeData.personalInfo.location}</span>
                      )}
                    </div>
                    {resumeData.personalInfo.linkedin && (
                      <div className="mt-2 text-sm text-inherit">
                        💼 {resumeData.personalInfo.linkedin}
                      </div>
                    )}
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                  </div>
                </div>
              ) : resumeData.template === "academic" ? (
                // Academic template - structured layout
                <div className="space-y-4">
                  <div className="text-center border-b border-white/20 pb-4">
                    <h1 className="text-3xl font-bold mb-2 text-inherit">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <p className="text-xl text-inherit opacity-90">
                      {resumeData.personalInfo.title}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-inherit opacity-80">
                    <div>
                      {resumeData.personalInfo.email && (
                        <div>Email: {resumeData.personalInfo.email}</div>
                      )}
                      {resumeData.personalInfo.phone && (
                        <div>Phone: {resumeData.personalInfo.phone}</div>
                      )}
                    </div>
                    <div>
                      {resumeData.personalInfo.location && (
                        <div>Location: {resumeData.personalInfo.location}</div>
                      )}
                      {resumeData.personalInfo.linkedin && (
                        <div>LinkedIn: {resumeData.personalInfo.linkedin}</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Default layout for other templates
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-1 text-inherit">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <p className="text-lg mb-3 text-inherit">
                      {resumeData.personalInfo.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-inherit">
                      {resumeData.personalInfo.email && (
                        <span>{resumeData.personalInfo.email}</span>
                      )}
                      {resumeData.personalInfo.phone && (
                        <span>{resumeData.personalInfo.phone}</span>
                      )}
                      {resumeData.personalInfo.location && (
                        <span>{resumeData.personalInfo.location}</span>
                      )}
                    </div>
                    {resumeData.personalInfo.linkedin && (
                      <div className="mt-2 text-sm text-inherit">
                        {resumeData.personalInfo.linkedin}
                      </div>
                    )}
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Professional Summary */}
              {resumeData.personalInfo.summary && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Professional Summary</h2>
                  <p className={cn(templateStyles.text, "leading-relaxed")}>
                    {resumeData.personalInfo.summary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              {resumeData.experience.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Work Experience</h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      {exp.description.length > 0 && (
                        <ul className={cn(templateStyles.text, "space-y-1 ml-4")}>
                          {exp.description.filter(desc => desc.trim()).map((desc, i) => (
                            <li key={i}>• {desc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Education</h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600 text-sm">{edu.institution} | {edu.location}</p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Technical Skills</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {resumeData.skills.map((skillCategory, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-800 mb-1">{skillCategory.category}</h4>
                        <p className="text-gray-600 text-sm">{skillCategory.skills.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Projects</h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={project.id} className="mb-4 last:mb-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                      <p className={cn(templateStyles.text, "mb-2")}>{project.description}</p>
                      {project.technologies.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Technologies:</strong> {project.technologies.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Certifications */}
              {resumeData.certifications.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Certifications</h2>
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="mb-3 last:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-gray-600 text-sm">{cert.issuer}</p>
                          {cert.credentialId && (
                            <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>
                          )}
                          {cert.url && (
                            <p className="text-gray-600 text-sm">{cert.url}</p>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {cert.date}
                          {cert.expirationDate ? ` • Expires: ${cert.expirationDate}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Achievements */}
              {resumeData.achievements.length > 0 && (
                <section className={templateStyles.section}>
                  <h2 className={templateStyles.sectionTitle}>Achievements</h2>
                  <ul className={cn(templateStyles.text, "space-y-2 ml-4 list-disc")}> 
                    {resumeData.achievements.map((ach) => (
                      <li key={ach.id}>
                        <span className="font-semibold text-gray-900">{ach.title}</span>
                        {" — "}
                        <span className="text-gray-700">{ach.description}</span>
                        {ach.date && (
                          <span className="text-gray-500"> {` (${ach.date})`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* ATS Score Indicator */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">ATS Compatibility Score</h4>
            {atsLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
            ) : (
              <span className="text-2xl font-bold text-green-600">
                {atsAnalysis?.score || 0}%
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${atsAnalysis?.score || 0}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {atsAnalysis?.score >= 80 ? "Excellent" : atsAnalysis?.score >= 60 ? "Good" : "Needs Improvement"} compatibility with ATS systems
            </span>
            <Badge variant="outline">
              {atsAnalysis?.keywords?.length || 0} keywords detected
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
