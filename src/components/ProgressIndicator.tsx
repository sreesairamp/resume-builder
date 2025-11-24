import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  formData: {
    full_name: string;
    email: string;
    summary: string;
    experience: any[];
    education: any[];
    skills: string[];
  };
}

export default function ProgressIndicator({ formData }: ProgressIndicatorProps) {
  const steps = [
    {
      name: 'Personal Info',
      completed: Boolean(formData.full_name && formData.email),
      fields: 2,
      filled: [formData.full_name, formData.email].filter(Boolean).length
    },
    {
      name: 'Summary',
      completed: Boolean(formData.summary),
      fields: 1,
      filled: formData.summary ? 1 : 0
    },
    {
      name: 'Experience',
      completed: formData.experience.length > 0,
      fields: 1,
      filled: formData.experience.length > 0 ? 1 : 0
    },
    {
      name: 'Education',
      completed: formData.education.length > 0,
      fields: 1,
      filled: formData.education.length > 0 ? 1 : 0
    },
    {
      name: 'Skills',
      completed: formData.skills.length > 0,
      fields: 1,
      filled: formData.skills.length > 0 ? 1 : 0
    }
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-6 shadow-md animate-fade-in sticky top-8">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Resume Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className="flex items-center gap-3 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {step.completed ? (
              <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
            ) : (
              <Circle size={20} className="text-gray-300 flex-shrink-0" />
            )}
            <div className="flex-grow">
              <p
                className={`text-sm font-medium ${
                  step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.name}
              </p>
            </div>
            <span className="text-xs text-gray-500">
              {step.filled}/{step.fields}
            </span>
          </div>
        ))}
      </div>

      {percentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-scale-in">
          <p className="text-sm text-green-800 font-medium text-center">
            Resume is complete!
          </p>
        </div>
      )}
    </div>
  );
}
