import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { MessageCircle, Send, Bot, User, Lightbulb, Zap, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: string[];
  confidence?: number;
}

interface ChatResponse {
  message: string;
  suggestions: string[];
  actions: string[];
  confidence: number;
}

interface AIChatProps {
  resumeData?: any;
  className?: string;
}

export function AIChat({ resumeData, className }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI resume assistant. I can help you improve your resume, provide specific advice, and answer any questions you have. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Ask me about improving specific sections",
        "Get ATS optimization advice",
        "Learn about resume best practices"
      ],
      actions: [
        "Generate a professional summary",
        "Run ATS analysis",
        "Get improvement suggestions"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          resumeData,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (response.ok) {
        const data: ChatResponse = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          suggestions: data.suggestions,
          actions: data.actions,
          confidence: data.confidence
        };

        setMessages(prev => [...prev, assistantMessage]);
        // Auto-expand new assistant messages to show suggestions
        setExpandedMessages(prev => new Set([...prev, assistantMessage.id]));
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const quickQuestions = [
    "How can I improve my experience section?",
    "What skills should I include?",
    "How do I make my resume ATS-friendly?",
    "Can you help me write a better summary?",
    "What's wrong with my current resume?",
    "How do I quantify my achievements?",
    "Which template should I choose?",
    "How long should my resume be?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleActionClick = (action: string) => {
    // Handle action clicks - could trigger specific features
    console.log('Action clicked:', action);
    // You could add specific handlers for different actions here
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        )}
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <Card className={cn(
          "fixed bottom-24 right-6 w-[450px] h-[700px] shadow-2xl z-40 border-2 border-blue-200",
          className
        )}>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="w-5 h-5" />
                AI Resume Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm opacity-90">Ask me anything about your resume!</p>
          </CardHeader>

          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 max-h-[500px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="max-w-[85%]">
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        )}
                      >
                        {message.content}
                      </div>
                      
                      {/* Show suggestions and actions for assistant messages */}
                      {message.role === 'assistant' && (message.suggestions?.length > 0 || message.actions?.length > 0) && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMessageExpansion(message.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 p-1 h-6"
                          >
                            {expandedMessages.has(message.id) ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Hide details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Show suggestions & actions
                              </>
                            )}
                          </Button>
                          
                          {expandedMessages.has(message.id) && (
                            <div className="mt-2 space-y-2">
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3" />
                                    Suggestions:
                                  </p>
                                  <div className="space-y-1">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-xs h-6 px-2 w-full justify-start text-left"
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.actions && message.actions.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Actions:
                                  </p>
                                  <div className="space-y-1">
                                    {message.actions.map((action, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleActionClick(action)}
                                        className="text-xs h-6 px-2 w-full justify-start text-left bg-blue-50 border-blue-200 hover:bg-blue-100"
                                      >
                                        {action}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Quick questions to get started:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs h-7 px-2"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your resume..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
