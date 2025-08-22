import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISuggestion {
  section: string;
  field: string;
  type: 'improvement' | 'optimization' | 'grammar' | 'ats';
  title: string;
  description: string;
  suggestedText?: string;
  confidence: number;
}

interface AIAssistantProps {
  resumeData: any;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ resumeData, onApplySuggestion, isOpen, onClose }: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const { toast } = useToast();

  const improveMutation = useMutation({
    mutationFn: async ({ text, context, jobDescription }: { text: string; context: string; jobDescription?: string }) => {
      const response = await apiRequest("POST", "/api/ai/improve-text", { text, context, jobDescription });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Text Improved",
        description: "AI has improved your text successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to improve text with AI.",
        variant: "destructive",
      });
    },
  });

  const summaryMutation = useMutation({
    mutationFn: async ({ personalInfo, experience, skills, jobDescription }: any) => {
      const response = await apiRequest("POST", "/api/ai/generate-summary", { 
        personalInfo, experience, skills, jobDescription 
      });
      return response.json();
    },
    onSuccess: (data) => {
      onApplySuggestion({
        section: "personalInfo",
        field: "summary",
        type: "improvement",
        title: "Generated Summary",
        description: "AI-generated professional summary",
        suggestedText: data.summary,
        confidence: 0.9,
      });
    },
  });

  const suggestionsMutation = useMutation({
    mutationFn: async ({ resumeData, section }: { resumeData: any; section: string }) => {
      const response = await apiRequest("POST", "/api/ai/suggestions", { resumeData, section });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data);
    },
  });

  const handleGetSuggestions = (section: string) => {
    setActiveSection(section);
    suggestionsMutation.mutate({ resumeData, section });
  };

  const handleGenerateSummary = () => {
    summaryMutation.mutate({
      personalInfo: resumeData.personalInfo,
      experience: resumeData.experience,
      skills: resumeData.skills,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "improvement": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "optimization": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "grammar": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "ats": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 z-50" data-testid="ai-assistant-panel">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-testid="button-close-ai"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Quick Actions</h4>
            
            <Button
              onClick={handleGenerateSummary}
              disabled={summaryMutation.isPending}
              className="w-full justify-start"
              variant="outline"
              data-testid="button-generate-summary"
            >
              {summaryMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Professional Summary
            </Button>

            <div className="grid grid-cols-2 gap-2">
              {["personalInfo", "experience", "education", "skills"].map((section) => (
                <Button
                  key={section}
                  onClick={() => handleGetSuggestions(section)}
                  disabled={suggestionsMutation.isPending && activeSection === section}
                  variant="outline"
                  size="sm"
                  data-testid={`button-suggest-${section}`}
                >
                  {suggestionsMutation.isPending && activeSection === section ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Suggestions</h4>
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium">{suggestion.title}</CardTitle>
                      <Badge className={getTypeColor(suggestion.type)}>
                        {suggestion.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {suggestion.description}
                    </p>
                    {suggestion.suggestedText && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-2 mb-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Suggested text:</p>
                        <p className="text-sm">{suggestion.suggestedText}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Confidence: {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion)}
                        data-testid={`button-apply-suggestion-${index}`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Loading State */}
          {suggestionsMutation.isPending && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing content...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
