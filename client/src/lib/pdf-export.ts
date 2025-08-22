import jsPDF from "jspdf";
import { Resume } from "@shared/schema";

export async function exportToPDF(resume: Resume): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35);
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  const personalInfo = resume.personalInfo as any;
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  pdf.text(fullName, 20, currentY);
  
  currentY += 8;
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text(personalInfo.title, 20, currentY);
  
  currentY += 10;
  pdf.setFontSize(10);
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location
  ].filter(Boolean).join(" | ");
  pdf.text(contactInfo, 20, currentY);
  
  if (personalInfo.linkedin) {
    currentY += 5;
    pdf.text(personalInfo.linkedin, 20, currentY);
  }

  currentY += 15;

  // Professional Summary
  if (personalInfo.summary) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROFESSIONAL SUMMARY", 20, currentY);
    currentY += 8;
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    currentY = addText(personalInfo.summary, 20, currentY, pageWidth - 40);
    currentY += 10;
  }

  // Work Experience
  const experience = resume.experience as any[];
  if (experience.length > 0) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("WORK EXPERIENCE", 20, currentY);
    currentY += 8;

    experience.forEach((exp, index) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(exp.position, 20, currentY);
      
      const endDate = exp.current ? "Present" : exp.endDate;
      const dateRange = `${exp.startDate} - ${endDate}`;
      const dateWidth = pdf.getTextWidth(dateRange);
      pdf.text(dateRange, pageWidth - 20 - dateWidth, currentY);
      
      currentY += 5;
      pdf.setFont("helvetica", "normal");
      pdf.text(`${exp.company} | ${exp.location}`, 20, currentY);
      currentY += 8;

      if (exp.description && exp.description.length > 0) {
        exp.description.forEach((bullet: string) => {
          if (currentY > pageHeight - 20) {
            pdf.addPage();
            currentY = 20;
          }
          currentY = addText(`• ${bullet}`, 25, currentY, pageWidth - 50);
          currentY += 2;
        });
      }
      currentY += 5;
    });
  }

  // Education
  const education = resume.education as any[];
  if (education.length > 0) {
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("EDUCATION", 20, currentY);
    currentY += 8;

    education.forEach((edu) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(edu.degree, 20, currentY);
      
      const eduEndDate = edu.endDate || "Present";
      const dateRange = `${edu.startDate} - ${eduEndDate}`;
      const dateWidth = pdf.getTextWidth(dateRange);
      pdf.text(dateRange, pageWidth - 20 - dateWidth, currentY);
      
      currentY += 5;
      pdf.setFont("helvetica", "normal");
      pdf.text(`${edu.institution} | ${edu.location}`, 20, currentY);
      currentY += 8;
    });
  }

  // Skills
  const skills = resume.skills as any[];
  if (skills.length > 0) {
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("TECHNICAL SKILLS", 20, currentY);
    currentY += 8;

    skills.forEach((skillCategory) => {
      if (currentY > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${skillCategory.category}:`, 20, currentY);
      
      pdf.setFont("helvetica", "normal");
      const skillsText = skillCategory.skills.join(", ");
      currentY = addText(skillsText, 80, currentY, pageWidth - 100);
      currentY += 3;
    });
  }

  // Projects
  const projects = resume.projects as any[];
  if (projects.length > 0) {
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROJECTS", 20, currentY);
    currentY += 8;

    projects.forEach((project) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(project.name, 20, currentY);
      currentY += 5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      currentY = addText(project.description, 20, currentY, pageWidth - 40);
      
      if (project.technologies && project.technologies.length > 0) {
        const techText = `Technologies: ${project.technologies.join(", ")}`;
        currentY = addText(techText, 20, currentY + 2, pageWidth - 40);
      }
      currentY += 5;
    });
  }

  // Save the PDF
  const fileName = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`;
  pdf.save(fileName);
}
