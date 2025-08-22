// server/services/ats-analyzer.ts

export interface ATSAnalysis {
  score: number;
  suggestions: string[];
  keywordMatches: string[];
  missingKeywords: string[];
  formatting: {
    score: number;
    issues: string[];
  };
}

export function analyzeResumeForATS(resumeText: string, jobDescription?: string): ATSAnalysis {
  const analysis: ATSAnalysis = {
    score: 0,
    suggestions: [],
    keywordMatches: [],
    missingKeywords: [],
    formatting: {
      score: 0,
      issues: []
    }
  };

  // Basic ATS formatting checks
  const formatIssues: string[] = [];
  
  // Check for common ATS-unfriendly elements
  if (resumeText.includes('<') || resumeText.includes('>')) {
    formatIssues.push('Avoid HTML tags and special characters');
  }
  
  if (resumeText.split('\n').length < 10) {
    formatIssues.push('Resume appears too short - consider adding more sections');
  }
  
  // Check for standard sections
  const hasContactInfo = /email|phone|@/.test(resumeText.toLowerCase());
  const hasExperience = /experience|work|employment|job/i.test(resumeText);
  const hasSkills = /skills|technical|technologies/i.test(resumeText);
  
  if (!hasContactInfo) formatIssues.push('Missing contact information');
  if (!hasExperience) formatIssues.push('Missing work experience section');
  if (!hasSkills) formatIssues.push('Missing skills section');
  
  analysis.formatting.issues = formatIssues;
  analysis.formatting.score = Math.max(0, 100 - (formatIssues.length * 15));
  
  // Basic keyword analysis
  const commonKeywords = [
    'leadership', 'management', 'analysis', 'communication', 'teamwork',
    'project', 'development', 'strategic', 'results', 'achievement',
    'collaboration', 'problem-solving', 'innovation', 'efficiency'
  ];
  
  const foundKeywords = commonKeywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword)
  );
  
  analysis.keywordMatches = foundKeywords;
  analysis.missingKeywords = commonKeywords.filter(k => !foundKeywords.includes(k));
  
  // Calculate overall score
  const keywordScore = (foundKeywords.length / commonKeywords.length) * 100;
  analysis.score = Math.round((keywordScore + analysis.formatting.score) / 2);
  
  // Generate suggestions
  if (analysis.score < 70) {
    analysis.suggestions.push('Add more relevant keywords from job descriptions');
  }
  if (formatIssues.length > 0) {
    analysis.suggestions.push('Improve formatting for better ATS compatibility');
  }
  if (foundKeywords.length < 5) {
    analysis.suggestions.push('Include more industry-relevant keywords');
  }
  if (!resumeText.includes('achieved') && !resumeText.includes('accomplished')) {
    analysis.suggestions.push('Add quantifiable achievements with numbers/percentages');
  }
  
  return analysis;
}