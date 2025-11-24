import { FileText, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import type { Resume, Experience, Education } from '../services/resumeService';
import { templates, type TemplateOption } from './ResumeTemplates';

interface LivePreviewProps {
  formData: Omit<Resume, 'id' | 'created_at' | 'updated_at'>;
  selectedTemplate: string;
}

export default function LivePreview({ formData, selectedTemplate }: LivePreviewProps) {
  const template = templates.find(t => t.id === selectedTemplate) || templates[0];

  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const getTemplateClasses = () => {
    const baseClasses = {
      professional: {
        header: 'bg-gradient-to-r from-blue-600 to-blue-700',
        badge: 'bg-blue-100 text-blue-800',
        section: 'border-blue-200',
        icon: 'text-blue-600'
      },
      modern: {
        header: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800',
        section: 'border-emerald-200',
        icon: 'text-emerald-600'
      },
      creative: {
        header: 'bg-gradient-to-r from-red-600 to-red-700',
        badge: 'bg-red-100 text-red-800',
        section: 'border-red-200',
        icon: 'text-red-600'
      },
      elegant: {
        header: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
        badge: 'bg-indigo-100 text-indigo-800',
        section: 'border-indigo-200',
        icon: 'text-indigo-600'
      }
    };

    return baseClasses[selectedTemplate as keyof typeof baseClasses] || baseClasses.professional;
  };

  const classes = getTemplateClasses();

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in sticky top-8">
      <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
        <FileText size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Live Preview</span>
      </div>

      <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className={`${classes.header} text-white p-6 rounded-t-lg -mx-8 -mt-8 mb-6`}>
          <div className="flex items-center gap-4">
            {formData.photo && (
              <img
                src={formData.photo}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {formData.full_name || 'Your Name'}
              </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {(formData.email || formData.phone || formData.location) && (
              <>
                {formData.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{formData.email}</span>
                  </div>
                )}
                {formData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>{formData.phone}</span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{formData.location}</span>
                  </div>
                )}
              </>
            )}
          </div>
            </div>
          </div>
        </div>

        {formData.summary && (
          <section className="mb-6 animate-slide-in">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
          </section>
        )}

        {formData.experience.length > 0 && (
          <section className="mb-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
            <h2 className={`text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 ${classes.section} flex items-center gap-2`}>
              <Briefcase size={20} className={classes.icon} />
              Work Experience
            </h2>
            <div className="space-y-4">
              {formData.experience.map((exp: Experience) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                  <h3 className="font-semibold text-gray-900">{exp.position || 'Position'}</h3>
                  <p className="text-gray-700 font-medium">{exp.company || 'Company'}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {formData.education.length > 0 && (
          <section className="mb-6 animate-slide-in" style={{ animationDelay: '200ms' }}>
            <h2 className={`text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 ${classes.section} flex items-center gap-2`}>
              <GraduationCap size={20} className={classes.icon} />
              Education
            </h2>
            <div className="space-y-4">
              {formData.education.map((edu: Education) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200">
                  <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-700 font-medium">{edu.institution || 'Institution'}</p>
                  <p className="text-sm text-gray-600">{edu.field || 'Field of Study'}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {formData.skills.length > 0 && (
          <section className="animate-slide-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 ${classes.badge} rounded-full text-sm font-medium`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {!formData.full_name && !formData.summary && formData.experience.length === 0 &&
         formData.education.length === 0 && formData.skills.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Start filling the form to see your resume preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
