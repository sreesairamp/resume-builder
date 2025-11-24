import { Check } from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  preview: {
    header: string;
    text: string;
    badge: string;
  };
}

const templates: TemplateOption[] = [
  {
    id: 'professional',
    name: 'Professional',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#dbeafe'
    },
    preview: {
      header: 'bg-blue-600',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800'
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#d1fae5'
    },
    preview: {
      header: 'bg-emerald-600',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#fee2e2'
    },
    preview: {
      header: 'bg-red-600',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#e0e7ff'
    },
    preview: {
      header: 'bg-indigo-600',
      text: 'text-indigo-900',
      badge: 'bg-indigo-100 text-indigo-800'
    }
  }
];

interface ResumeTemplatesProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export default function ResumeTemplates({ selectedTemplate, onSelectTemplate }: ResumeTemplatesProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelectTemplate(template.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 animate-slide-in hover:scale-105 ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1 shadow-lg animate-scale-in">
                <Check size={16} className="text-white" />
              </div>
            )}

            <div className="space-y-2">
              <div className={`h-8 ${template.preview.header} rounded-md`} />
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded w-full" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="flex gap-1">
                <div className={`h-4 w-12 ${template.preview.badge} rounded text-[0px]`}>x</div>
                <div className={`h-4 w-12 ${template.preview.badge} rounded text-[0px]`}>x</div>
              </div>
            </div>

            <p className={`text-sm font-medium mt-3 ${
              selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {template.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export { templates };
export type { TemplateOption };
