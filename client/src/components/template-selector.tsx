import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates, Template } from "@/lib/templates";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ isOpen, onClose, currentTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelectTemplate(templateId);
    onClose();
  };

  const renderTemplatePreview = (template: Template) => {
    const isSelected = selectedTemplate === template.id;
    
    return (
      <Card 
        key={template.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleSelectTemplate(template.id)}
        data-testid={`template-option-${template.id}`}
      >
        <CardContent className="p-4">
          <div className="relative">
            {/* Template Preview */}
            <div className="bg-white rounded shadow-sm h-40 border border-gray-200 flex items-center justify-center mb-3">
              {template.id === "modern" && (
                <div className="w-full h-full p-2">
                  <div className="w-full h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t mb-2"></div>
                  <div className="space-y-1 px-2">
                    <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === "classic" && (
                <div className="w-full h-full p-2">
                  <div className="border-b-2 border-gray-800 pb-2 mb-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-1"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-3/4 h-1 bg-gray-300 rounded mx-auto"></div>
                    <div className="w-1/2 h-1 bg-gray-300 rounded mx-auto"></div>
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === "creative" && (
                <div className="w-full h-full p-2">
                  <div className="w-full h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
              
              {template.id === "minimal" && (
                <div className="w-full h-full p-2">
                  <div className="border-l-4 border-gray-700 pl-2 mb-2">
                    <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                    <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
            {isSelected && (
              <Badge className="mt-2">Current</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="template-selector-modal">
        <DialogHeader>
          <DialogTitle>Choose Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4">
          {templates.map(renderTemplatePreview)}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-template">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
