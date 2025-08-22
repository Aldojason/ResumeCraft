export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional",
    preview: "modern-preview"
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout",
    preview: "classic-preview"
  },
  {
    id: "creative",
    name: "Creative",
    description: "Eye-catching design",
    preview: "creative-preview"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple",
    preview: "minimal-preview"
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium and sophisticated",
    preview: "executive-preview"
  },
  {
    id: "tech",
    name: "Tech",
    description: "Modern tech industry style",
    preview: "tech-preview"
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined and graceful",
    preview: "elegant-preview"
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong and confident",
    preview: "bold-preview"
  },
  {
    id: "academic",
    name: "Academic",
    description: "Research and education focused",
    preview: "academic-preview"
  },
  {
    id: "startup",
    name: "Startup",
    description: "Dynamic and innovative",
    preview: "startup-preview"
  }
];

export function getTemplateStyles(templateId: string) {
  const baseStyles = {
    container: "bg-white shadow-xl rounded-lg overflow-hidden",
    header: "",
    section: "mb-6",
    sectionTitle: "text-lg font-bold text-gray-900 border-b-2 pb-1 mb-3",
    text: "text-gray-700 text-sm",
  };

  switch (templateId) {
    case "modern":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6",
        sectionTitle: "text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-3",
      };
    
    case "classic":
      return {
        ...baseStyles,
        header: "border-b-4 border-gray-800 p-6 bg-gray-50 text-gray-900",
        sectionTitle: "text-lg font-bold text-gray-900 border-b border-gray-400 pb-1 mb-3",
      };
    
    case "creative":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6",
        sectionTitle: "text-lg font-bold text-gray-900 border-b-2 border-purple-600 pb-1 mb-3",
      };
    
    case "minimal":
      return {
        ...baseStyles,
        header: "border-l-8 border-gray-700 p-6 bg-white text-gray-900",
        sectionTitle: "text-lg font-semibold text-gray-800 mb-3",
      };
    
    case "executive":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8",
        sectionTitle: "text-lg font-bold text-slate-800 border-b-2 border-slate-600 pb-2 mb-4",
        text: "text-slate-600 text-sm",
      };
    
    case "tech":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-6",
        sectionTitle: "text-lg font-bold text-indigo-700 border-b-2 border-indigo-400 pb-2 mb-3",
        text: "text-gray-600 text-sm",
      };
    
    case "elegant":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-rose-400 to-pink-400 text-white p-7",
        sectionTitle: "text-lg font-semibold text-rose-700 border-b border-rose-300 pb-2 mb-4",
        text: "text-gray-600 text-sm",
      };
    
    case "bold":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-orange-500 to-red-500 text-white p-6",
        sectionTitle: "text-lg font-bold text-orange-600 border-b-2 border-orange-400 pb-2 mb-3",
        text: "text-gray-700 text-sm",
      };
    
    case "academic":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6",
        sectionTitle: "text-lg font-bold text-emerald-700 border-b-2 border-emerald-500 pb-2 mb-3",
        text: "text-gray-600 text-sm",
      };
    
    case "startup":
      return {
        ...baseStyles,
        header: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-6",
        sectionTitle: "text-lg font-bold text-violet-600 border-b-2 border-violet-400 pb-2 mb-3",
        text: "text-gray-600 text-sm",
      };
    
    default:
      return baseStyles;
  }
}
