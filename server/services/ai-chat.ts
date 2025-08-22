import { HfInference } from '@huggingface/inference';

const hasHfKey = Boolean(process.env.HUGGINGFACE_API_KEY);
const hf = hasHfKey ? new HfInference(process.env.HUGGINGFACE_API_KEY) : (undefined as any);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions: string[];
  actions: string[];
  confidence: number;
}

export async function chatWithAI(
  userMessage: string,
  resumeData?: any,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    const context = buildContext(userMessage, resumeData, conversationHistory);
    const systemPrompt = createSystemPrompt(resumeData);

    // If no HF key, return intelligent fallback immediately
    if (!hasHfKey) {
      return generateIntelligentFallbackResponse(userMessage, resumeData);
    }

    // Compose a single prompt for instruction-tuned text generation
    const prompt = [
      systemPrompt,
      conversationHistory.slice(-4).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n'),
      `USER: ${userMessage}`,
      'ASSISTANT: '
    ].filter(Boolean).join('\n');

    const result = await hf.textGeneration({
      model: 'tiiuae/falcon-7b-instruct',
      inputs: prompt,
      parameters: {
        max_new_tokens: 256,
        temperature: 0.7,
        return_full_text: false
      }
    });

    const message = (result as any)?.generated_text || '';
    const finalMessage = (message || '').trim() || createDirectAnswer(userMessage, resumeData);

    const suggestions = extractIntelligentSuggestions(finalMessage, userMessage, resumeData);
    const actions = extractIntelligentActions(finalMessage, userMessage, resumeData);

    return {
      message: finalMessage,
      suggestions,
      actions,
      confidence: 0.9
    };
  } catch (error) {
    console.error('AI Chat error:', error);
    return generateIntelligentFallbackResponse(userMessage, resumeData);
  }
}

function createSystemPrompt(resumeData?: any): string {
  return [
    'You are an expert resume and job search assistant.',
    'Answer directly, be concise, and provide actionable steps and examples.',
    resumeData?.personalInfo?.title ? `The user target role is ${resumeData.personalInfo.title}.` : '',
  ].filter(Boolean).join(' ');
}

function createDirectAnswer(userMessage: string, resumeData?: any): string {
  const intent = analyzeUserIntent(userMessage);
  switch (intent) {
    case 'experience_help':
      return "Use action verbs and quantify outcomes (e.g., 'Reduced costs by 18%'). Focus bullets on impact, not tasks.";
    case 'summary_help':
      return 'Write 2–3 sentences: title, years, top achievements, and target role. Keep it ATS-friendly.';
    case 'skills_guidance':
      return 'Group skills by Technical/Soft, mirror keywords from the target JD, and keep names standard (e.g., React, Node.js, SQL).';
    case 'ats_optimization':
      return 'Extract keywords from target JDs, use standard titles, avoid tables/graphics, and keep layout simple for ATS.';
    default:
      return 'Tell me which section (summary, experience, skills, ATS) you want to improve and your target role. I will give focused steps.';
  }
}

function createIntelligentPrompt(userMessage: string, context: string, resumeData?: any): string {
  const userIntent = analyzeUserIntent(userMessage);
  const resumeContext = analyzeResumeContext(resumeData);
  const prompt = `You are an expert resume consultant. Question: ${userMessage} Intent: ${userIntent} Resume: ${resumeContext} Context: ${context}. Answer directly with actionable advice in 4–8 sentences.`;
  return prompt;
}

function analyzeUserIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('improve') || lowerMessage.includes('better')) return 'improvement';
  if (lowerMessage.includes('ats') || lowerMessage.includes('keywords')) return 'ats_optimization';
  if (lowerMessage.includes('skill')) return 'skills_guidance';
  if (lowerMessage.includes('summary') || lowerMessage.includes('objective')) return 'summary_help';
  if (lowerMessage.includes('experience')) return 'experience_help';
  if (lowerMessage.includes('template') || lowerMessage.includes('format')) return 'formatting_design';
  return 'general_resume_advice';
}

function analyzeResumeContext(resumeData?: any): string {
  if (!resumeData) return 'no resume data';
  const parts: string[] = [];
  if (resumeData.personalInfo?.title) parts.push(`title=${resumeData.personalInfo.title}`);
  if (Array.isArray(resumeData.experience)) parts.push(`experience=${resumeData.experience.length}`);
  if (Array.isArray(resumeData.skills)) parts.push(`skills=${resumeData.skills.length}`);
  if (Array.isArray(resumeData.education)) parts.push(`education=${resumeData.education.length}`);
  return parts.join(', ') || 'basic';
}

function safeSkillName(skill: any): string {
  if (!skill) return '';
  if (typeof skill === 'string') return skill.toLowerCase();
  if (typeof skill.name === 'string') return skill.name.toLowerCase();
  return '';
}

function categorizeSkills(skills: any[]): string {
  const names = Array.isArray(skills) ? skills.map(safeSkillName) : [];
  const technical = names.filter((n) => n.includes('python') || n.includes('java') || n.includes('react') || n.includes('node') || n.includes('aws') || n.includes('sql') || n.includes('programming') || n.includes('software')).length;
  const soft = names.filter((n) => n.includes('leadership') || n.includes('communication') || n.includes('team') || n.includes('management') || n.includes('collaboration')).length;
  return `${technical} technical, ${soft} soft skills`;
}

function buildContext(userMessage: string, resumeData?: any, history: ChatMessage[] = []): string {
  let context = '';
  if (resumeData) {
    const hasExperience = Array.isArray(resumeData.experience) && resumeData.experience.length > 0;
    const hasSkills = Array.isArray(resumeData.skills) && resumeData.skills.length > 0;
    const hasEducation = Array.isArray(resumeData.education) && resumeData.education.length > 0;
    context = `hasExperience=${hasExperience}, hasSkills=${hasSkills}, hasEducation=${hasEducation}. `;
    if (resumeData.personalInfo?.title) context += `jobTitle=${resumeData.personalInfo.title}. `;
  }
  if (history.length > 0) {
    const recent = history.slice(-3).map((m) => `${m.role}:${m.content}`).join(' | ');
    context += `recent: ${recent}`;
  }
  return context.trim();
}

function extractIntelligentSuggestions(aiResponse: string, userMessage: string, resumeData?: any): string[] {
  const suggestions: string[] = [];
  const lower = userMessage.toLowerCase();
  if (lower.includes('experience')) suggestions.push('Start bullets with strong action verbs', 'Add metrics (e.g., +25% conversion)');
  if (lower.includes('skill')) suggestions.push('Group skills by Technical/Soft', 'Match skills to JD keywords');
  if (lower.includes('summary')) suggestions.push('Include title, years of experience, 2-3 key strengths');
  if (lower.includes('ats') || lower.includes('keywords')) suggestions.push('Add industry keywords from target JD', 'Keep layout ATS-friendly');
  if (suggestions.length < 3) suggestions.push('Ensure consistent formatting', 'Keep resume to 1–2 pages');
  return suggestions.slice(0, 5);
}

function extractIntelligentActions(aiResponse: string, userMessage: string, resumeData?: any): string[] {
  const actions: string[] = [];
  const lower = userMessage.toLowerCase();
  if (lower.includes('summary')) actions.push('Use AI to generate a professional summary');
  if (lower.includes('ats') || lower.includes('keywords')) actions.push('Run ATS analysis');
  if (lower.includes('improve') || lower.includes('experience')) actions.push('Use AI text improvement for experience');
  if (lower.includes('skill')) actions.push('Get skill optimization suggestions');
  return actions.slice(0, 3);
}

function generateIntelligentFallbackResponse(userMessage: string, resumeData?: any): ChatResponse {
  const lower = userMessage.toLowerCase();
  if (lower.includes('experience')) {
    return {
      message: "Focus on achievements using action verbs and numbers. Example: 'Reduced page load time by 40% by optimizing bundle splitting and caching.'",
      suggestions: ['Start bullets with verbs', 'Quantify results', 'Show impact'],
      actions: ['Use AI text improvement for experience'],
      confidence: 0.9
    };
  }
  if (lower.includes('summary')) {
    return {
      message: 'Write 2–3 concise sentences: title, years, top achievements, and target role.',
      suggestions: ['Lead with title/years', 'Include 2–3 strengths', 'Tailor to target role'],
      actions: ['Use AI to generate a professional summary'],
      confidence: 0.9
    };
  }
  if (lower.includes('ats') || lower.includes('keywords')) {
    return {
      message: 'Pull keywords from target job descriptions, use standard skill names, and keep formatting simple for ATS parsing.',
      suggestions: ['Extract keywords from JD', 'Avoid tables/graphics', 'Use standard titles'],
      actions: ['Run ATS analysis'],
      confidence: 0.9
    };
  }
  return {
    message: 'Tell me which section you want to improve (summary, experience, skills, ATS). I will give focused, actionable steps.',
    suggestions: ['Choose a section to focus', 'Share target job title/JD'],
    actions: ['Run ATS analysis', 'Generate a professional summary'],
    confidence: 0.85
  };
}

export async function getSectionAdvice(section: string, content: any): Promise<ChatResponse> {
  const userMessage = `Give me specific advice on improving my ${section} section`;
  return chatWithAI(userMessage, { [section]: content });
}

export async function getCareerAdvice(jobTitle: string, experience: any[]): Promise<ChatResponse> {
  const userMessage = `I'm applying for ${jobTitle} positions. What specific advice do you have for my resume based on my experience?`;
  return chatWithAI(userMessage, { experience, targetRole: jobTitle });
}
