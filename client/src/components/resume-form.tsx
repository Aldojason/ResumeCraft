import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2, GripVertical, User, Briefcase, GraduationCap, Code, FolderOpen, Award, Trophy } from "lucide-react";
import { insertResumeSchema, type InsertResume } from "@shared/schema";
import { useAutoSave } from "@/hooks/use-resume";
import { cn } from "@/lib/utils";

interface ResumeFormProps {
  resumeData: InsertResume;
  onDataChange: (data: Partial<InsertResume>) => void;
  resumeId?: string;
  className?: string;
}

export function ResumeForm({ resumeData, onDataChange, resumeId, className }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const { lastSaved, isSaving } = useAutoSave(resumeId || "", resumeData, !!resumeId);

  const form = useForm<InsertResume>({
    resolver: zodResolver(insertResumeSchema),
    defaultValues: resumeData,
  });

  const handleFormChange = (field: keyof InsertResume, value: any) => {
    const updatedData = { ...resumeData, [field]: value };
    onDataChange(updatedData);
    form.setValue(field, value);
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: [""],
    };
    const updatedExperience = [...resumeData.experience, newExperience];
    handleFormChange("experience", updatedExperience);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = resumeData.experience.filter((_, i) => i !== index);
    handleFormChange("experience", updatedExperience);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    handleFormChange("experience", updatedExperience);
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      location: "",
      gpa: "",
      description: [],
    };
    const updatedEducation = [...resumeData.education, newEducation];
    handleFormChange("education", updatedEducation);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = resumeData.education.filter((_, i) => i !== index);
    handleFormChange("education", updatedEducation);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    handleFormChange("education", updatedEducation);
  };

  const addSkillCategory = () => {
    const newSkillCategory = {
      category: "",
      skills: [],
    };
    const updatedSkills = [...resumeData.skills, newSkillCategory];
    handleFormChange("skills", updatedSkills);
  };

  const removeSkillCategory = (index: number) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    handleFormChange("skills", updatedSkills);
  };

  const updateSkillCategory = (index: number, field: string, value: any) => {
    const updatedSkills = [...resumeData.skills];
    if (field === "skills" && typeof value === "string") {
      updatedSkills[index].skills = value.split(",").map(s => s.trim()).filter(s => s);
    } else {
      updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    }
    handleFormChange("skills", updatedSkills);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
    };
    const updatedProjects = [...resumeData.projects, newProject];
    handleFormChange("projects", updatedProjects);
  };

  const removeProject = (index: number) => {
    const updatedProjects = resumeData.projects.filter((_, i) => i !== index);
    handleFormChange("projects", updatedProjects);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updatedProjects = [...resumeData.projects];
    if (field === "technologies" && typeof value === "string") {
      updatedProjects[index].technologies = value.split(",").map(s => s.trim()).filter(s => s);
    } else {
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    }
    handleFormChange("projects", updatedProjects);
  };

  // Certifications handlers
  const addCertification = () => {
    const newCertification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      expirationDate: "",
      credentialId: "",
      url: "",
    };
    const updatedCerts = [...resumeData.certifications, newCertification];
    handleFormChange("certifications", updatedCerts);
  };

  const removeCertification = (index: number) => {
    const updatedCerts = resumeData.certifications.filter((_, i) => i !== index);
    handleFormChange("certifications", updatedCerts);
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const updatedCerts = [...resumeData.certifications];
    updatedCerts[index] = { ...updatedCerts[index], [field]: value };
    handleFormChange("certifications", updatedCerts);
  };

  // Achievements handlers
  const addAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      title: "",
      description: "",
      date: "",
    };
    const updated = [...resumeData.achievements, newAchievement];
    handleFormChange("achievements", updated);
  };

  const removeAchievement = (index: number) => {
    const updated = resumeData.achievements.filter((_, i) => i !== index);
    handleFormChange("achievements", updated);
  };

  const updateAchievement = (index: number, field: string, value: any) => {
    const updated = [...resumeData.achievements];
    updated[index] = { ...updated[index], [field]: value };
    handleFormChange("achievements", updated);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <div className={cn("bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto lg:border-r", className)}>
      <div className="p-4 sm:p-6">
        {/* Auto-save indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Resume Progress</span>
            <div className="flex items-center space-x-2">
              {isSaving && <span>Saving...</span>}
              {lastSaved && !isSaving && (
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>

        <Form {...form}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4 sm:mb-6 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs p-2 sm:p-3"
                    data-testid={`tab-${tab.id}`}
                  >
                    <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline text-xs">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              value={resumeData.personalInfo.firstName}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange("personalInfo", {
                                  ...resumeData.personalInfo,
                                  firstName: e.target.value,
                                });
                              }}
                              data-testid="input-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              value={resumeData.personalInfo.lastName}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange("personalInfo", {
                                  ...resumeData.personalInfo,
                                  lastName: e.target.value,
                                });
                              }}
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="personalInfo.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Software Engineer"
                            {...field}
                            value={resumeData.personalInfo.title}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange("personalInfo", {
                                ...resumeData.personalInfo,
                                title: e.target.value,
                              });
                            }}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personalInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john.doe@email.com"
                              type="email"
                              {...field}
                              value={resumeData.personalInfo.email}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange("personalInfo", {
                                  ...resumeData.personalInfo,
                                  email: e.target.value,
                                });
                              }}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personalInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                              value={resumeData.personalInfo.phone}
                              onChange={(e) => {
                                field.onChange(e);
                                handleFormChange("personalInfo", {
                                  ...resumeData.personalInfo,
                                  phone: e.target.value,
                                });
                              }}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="personalInfo.location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="San Francisco, CA"
                            {...field}
                            value={resumeData.personalInfo.location}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange("personalInfo", {
                                ...resumeData.personalInfo,
                                location: e.target.value,
                              });
                            }}
                            data-testid="input-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalInfo.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/johndoe"
                            {...field}
                            value={resumeData.personalInfo.linkedin || ""}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange("personalInfo", {
                                ...resumeData.personalInfo,
                                linkedin: e.target.value,
                              });
                            }}
                            data-testid="input-linkedin"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalInfo.summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Experienced software engineer with 5+ years of experience..."
                            rows={4}
                            {...field}
                            value={resumeData.personalInfo.summary}
                            onChange={(e) => {
                              field.onChange(e);
                              handleFormChange("personalInfo", {
                                ...resumeData.personalInfo,
                                summary: e.target.value,
                              });
                            }}
                            data-testid="input-summary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Experience */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span>Work Experience</span>
                    </CardTitle>
                    <Button onClick={addExperience} data-testid="button-add-experience">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <Card key={exp.id} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Experience {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                            data-testid={`button-remove-experience-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input
                            placeholder="Position Title"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                            data-testid={`input-experience-position-${index}`}
                          />
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            data-testid={`input-experience-company-${index}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <Input
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            data-testid={`input-experience-start-${index}`}
                          />
                          <Input
                            placeholder="End Date"
                            value={exp.endDate || ""}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            disabled={exp.current}
                            data-testid={`input-experience-end-${index}`}
                          />
                          <Input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => updateExperience(index, "location", e.target.value)}
                            data-testid={`input-experience-location-${index}`}
                          />
                        </div>

                        <Textarea
                          placeholder="• Led development of microservices architecture...&#10;• Implemented CI/CD pipelines..."
                          rows={4}
                          value={exp.description.join("\n")}
                          onChange={(e) => 
                            updateExperience(index, "description", e.target.value.split("\n"))
                          }
                          data-testid={`input-experience-description-${index}`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <span>Education</span>
                    </CardTitle>
                    <Button onClick={addEducation} data-testid="button-add-education">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <Card key={edu.id} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Education {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(index)}
                            data-testid={`button-remove-education-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            data-testid={`input-education-degree-${index}`}
                          />
                          <Input
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            data-testid={`input-education-institution-${index}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Input
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                            data-testid={`input-education-start-${index}`}
                          />
                          <Input
                            placeholder="End Date"
                            value={edu.endDate || ""}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                            data-testid={`input-education-end-${index}`}
                          />
                          <Input
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => updateEducation(index, "location", e.target.value)}
                            data-testid={`input-education-location-${index}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="w-5 h-5 text-primary" />
                      <span>Skills</span>
                    </CardTitle>
                    <Button onClick={addSkillCategory} data-testid="button-add-skill-category">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.skills.map((skillCategory, index) => (
                    <Card key={index} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="outline">Category {index + 1}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkillCategory(index)}
                            data-testid={`button-remove-skill-category-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <Input
                            placeholder="Category (e.g., Frontend, Backend)"
                            value={skillCategory.category}
                            onChange={(e) => updateSkillCategory(index, "category", e.target.value)}
                            data-testid={`input-skill-category-${index}`}
                          />
                          <Input
                            placeholder="Skills (comma-separated)"
                            value={skillCategory.skills.join(", ")}
                            onChange={(e) => updateSkillCategory(index, "skills", e.target.value)}
                            data-testid={`input-skills-${index}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5 text-primary" />
                      <span>Projects</span>
                    </CardTitle>
                    <Button onClick={addProject} data-testid="button-add-project">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <Card key={project.id} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Project {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(index)}
                            data-testid={`button-remove-project-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <Input
                            placeholder="Project Name"
                            value={project.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            data-testid={`input-project-name-${index}`}
                          />
                          <Textarea
                            placeholder="Project Description"
                            rows={3}
                            value={project.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            data-testid={`input-project-description-${index}`}
                          />
                          <Input
                            placeholder="Technologies (comma-separated)"
                            value={project.technologies.join(", ")}
                            onChange={(e) => updateProject(index, "technologies", e.target.value)}
                            data-testid={`input-project-technologies-${index}`}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              placeholder="Project URL"
                              value={project.url || ""}
                              onChange={(e) => updateProject(index, "url", e.target.value)}
                              data-testid={`input-project-url-${index}`}
                            />
                            <Input
                              placeholder="GitHub URL"
                              value={project.github || ""}
                              onChange={(e) => updateProject(index, "github", e.target.value)}
                              data-testid={`input-project-github-${index}`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications */}
            <TabsContent value="certifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span>Certifications</span>
                    </CardTitle>
                    <Button onClick={addCertification} data-testid="button-add-certification">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.certifications.map((cert, index) => (
                    <Card key={cert.id} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Certification {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                            data-testid={`button-remove-certification-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input
                            placeholder="Certification Name"
                            value={cert.name}
                            onChange={(e) => updateCertification(index, "name", e.target.value)}
                            data-testid={`input-cert-name-${index}`}
                          />
                          <Input
                            placeholder="Issuer (e.g., AWS)"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                            data-testid={`input-cert-issuer-${index}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <Input
                            placeholder="Date (YYYY-MM)"
                            value={cert.date}
                            onChange={(e) => updateCertification(index, "date", e.target.value)}
                            data-testid={`input-cert-date-${index}`}
                          />
                          <Input
                            placeholder="Expiration (optional)"
                            value={cert.expirationDate || ""}
                            onChange={(e) => updateCertification(index, "expirationDate", e.target.value)}
                            data-testid={`input-cert-expiration-${index}`}
                          />
                          <Input
                            placeholder="Credential ID (optional)"
                            value={cert.credentialId || ""}
                            onChange={(e) => updateCertification(index, "credentialId", e.target.value)}
                            data-testid={`input-cert-id-${index}`}
                          />
                        </div>

                        <Input
                          placeholder="Verification URL (optional)"
                          value={cert.url || ""}
                          onChange={(e) => updateCertification(index, "url", e.target.value)}
                          data-testid={`input-cert-url-${index}`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span>Achievements</span>
                    </CardTitle>
                    <Button onClick={addAchievement} data-testid="button-add-achievement">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.achievements.map((ach, index) => (
                    <Card key={ach.id} className="border border-gray-200 dark:border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <Badge variant="outline">Achievement {index + 1}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAchievement(index)}
                            data-testid={`button-remove-achievement-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <Input
                            placeholder="Title"
                            value={ach.title}
                            onChange={(e) => updateAchievement(index, "title", e.target.value)}
                            data-testid={`input-ach-title-${index}`}
                          />
                          <Input
                            placeholder="Date (YYYY-MM)"
                            value={ach.date}
                            onChange={(e) => updateAchievement(index, "date", e.target.value)}
                            data-testid={`input-ach-date-${index}`}
                          />
                        </div>

                        <Textarea
                          placeholder="Describe the achievement and impact"
                          rows={3}
                          value={ach.description}
                          onChange={(e) => updateAchievement(index, "description", e.target.value)}
                          data-testid={`input-ach-description-${index}`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Form>
      </div>
    </div>
  );
}
