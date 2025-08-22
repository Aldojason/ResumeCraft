import { HfInference } from '@huggingface/inference';

const HF_TEXT_MODEL = process.env.HUGGINGFACE_TEXT_MODEL || '';
const canCallHF = Boolean(process.env.HUGGINGFACE_API_KEY && HF_TEXT_MODEL);
const hf = canCallHF ? new HfInference(process.env.HUGGINGFACE_API_KEY) : (undefined as any);

export interface AIImprovementSuggestion {
  section: string;
  field: string;
  type: 'improvement' | 'optimization' | 'grammar' | 'ats';
  title: string;
  description: string;
  suggestedText?: string;
  confidence: number;
}

export interface ATSAnalysis {
  score: number;
  keywords: string[];
  suggestions: string[];
  improvements: string[];
}

export async function improveResumeText(
  text: string, 
  context: string,
  jobDescription?: string
): Promise<string> {
  try {
    // If HF not configured, return deterministic improvement
    if (!canCallHF) {
      return `${text}`.trim();
    }

    const prompt = `Improve this ${context} text to make it more professional and impactful: "${text}"`;

    const response = await hf.textGeneration({
      model: HF_TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false
      }
    });

    return (response as any)?.generated_text?.trim() || text;
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return text; // Return original text if API fails
  }
}

export async function generateProfessionalSummary(
  personalInfo: any,
  experience: any[],
  skills: any[],
  jobDescription?: string
): Promise<string> {
  try {
    const skillsList = skills.flatMap(category => category.skills).join(', ');
    const experienceYears = experience.length > 0 ? experience.length : 'multiple';
    
    const prompt = `Generate a professional summary for a resume: Title: ${personalInfo.title}, Skills: ${skillsList}, Experience: ${experienceYears}`;
    
    if (!canCallHF) {
      return generateFallbackSummary(personalInfo, experience, skills);
    }

    const response = await hf.textGeneration({
      model: HF_TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        return_full_text: false
      }
    });

    return (response as any)?.generated_text?.trim() || generateFallbackSummary(personalInfo, experience, skills);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return generateFallbackSummary(personalInfo, experience, skills);
  }
}

export async function analyzeResumeForATS(resumeData: any): Promise<ATSAnalysis> {
  try {
    const skills = resumeData.skills?.flatMap((category: any) => category.skills).join(', ') || '';
    const experience = resumeData.experience?.map((exp: any) => exp.position).join(', ') || '';
    
    const prompt = `Analyze this resume for ATS compatibility. Skills: ${skills}, Experience: ${experience}`;
    
    if (!canCallHF) {
      return {
        score: 70,
        keywords: skills.split(',').slice(0, 5).map((s: string) => s.trim()).filter(Boolean),
        suggestions: [
          "Include more quantifiable achievements",
          "Use industry-specific keywords",
          "Ensure consistent formatting"
        ],
        improvements: [
          "Add metrics to experience descriptions",
          "Include relevant certifications",
          "Optimize for target job keywords"
        ],
      };
    }

    const response = await hf.textGeneration({
      model: HF_TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.5,
        return_full_text: false
      }
    });

    const analysis = (response as any)?.generated_text?.trim() || '';
    
    return {
      score: Math.min(85, Math.max(60, analysis.length * 2)), // Simple scoring based on content length
      keywords: skills.split(',').slice(0, 5),
      suggestions: [
        "Include more quantifiable achievements",
        "Use industry-specific keywords",
        "Ensure consistent formatting"
      ],
      improvements: [
        "Add metrics to experience descriptions",
        "Include relevant certifications",
        "Optimize for target job keywords"
      ],
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return {
      score: 70,
      keywords: [],
      suggestions: ["Check your internet connection and try again"],
      improvements: ["Verify API key configuration"],
    };
  }
}

export async function getSuggestions(
  resumeData: any, 
  section: string
): Promise<AIImprovementSuggestion[]> {
  try {
    const prompt = `Provide improvement suggestions for the ${section} section of this resume`;
    
    if (!canCallHF) {
      return getFallbackSuggestions(section);
    }

    const response = await hf.textGeneration({
      model: HF_TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 80,
        temperature: 0.6,
        return_full_text: false
      }
    });

    const suggestion = (response as any)?.generated_text?.trim();
    
    if (suggestion) {
      return [{
        section,
        field: section,
        type: 'improvement',
        title: 'AI Suggestion',
        description: suggestion,
        confidence: 0.8
      }];
    } else {
      return getFallbackSuggestions(section);
    }
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return getFallbackSuggestions(section);
  }
}

// Fallback functions
function generateFallbackSummary(personalInfo: any, experience: any[], skills: any[]): string {
  let summary = `Experienced ${personalInfo.title || 'professional'} with a proven track record of success. `;
  
  if (experience.length > 0) {
    summary += `Skilled in ${experience[0]?.position || 'various roles'} with strong leadership and analytical capabilities. `;
  }
  
  if (skills.length > 0) {
    const skillList = skills.flatMap(category => category.skills).slice(0, 3).join(', ');
    summary += `Proficient in ${skillList} and committed to delivering excellent results.`;
  } else {
    summary += `Committed to continuous professional growth and delivering exceptional results.`;
  }
  
  return summary;
}

function getFallbackSuggestions(section: string): AIImprovementSuggestion[] {
  return [{
    section,
    field: section,
    type: 'improvement',
    title: 'General Improvement',
    description: `Consider enhancing the ${section} section with more specific details and achievements.`,
    confidence: 0.7
  }];
}