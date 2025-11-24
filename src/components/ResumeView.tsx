import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Download } from 'lucide-react';
import { resumeService, type Resume } from '../services/resumeService';
import { exportToPDF } from '../utils/pdfExport';

export default function ResumeView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getById(id!);
      setResume(data);
    } catch (error) {
      toast.error('Failed to load resume');
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!resume) return;
    try {
      await exportToPDF('resume-content', `${resume.full_name}_Resume.pdf`);
      toast.success('Resume exported successfully!');
    } catch (error) {
      toast.error('Failed to export resume');
      console.error(error);
    }
  };

  const formatMonthYear = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-xl text-gray-600">Loading resume...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-xl text-gray-600">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            Back to List
          </button>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Edit size={20} />
            Edit Resume
          </button>
        </div>

        <div id="resume-content" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-6">
              {resume.photo && (
                <img
                  src={resume.photo}
                  alt={resume.full_name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{resume.full_name}</h1>
                <div className="flex flex-wrap gap-4 text-blue-50">
              {resume.email && (
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{resume.email}</span>
                </div>
              )}
              {resume.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>{resume.phone}</span>
                </div>
              )}
              {resume.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{resume.location}</span>
                </div>
              )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {resume.summary && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={24} className="text-blue-600" />
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
              </section>
            )}

            {resume.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <Briefcase size={24} className="text-blue-600" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="relative pl-8 border-l-2 border-blue-200">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                      <div className="mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatMonthYear(exp.startDate)} - {exp.current ? 'Present' : formatMonthYear(exp.endDate)}
                        </p>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resume.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <GraduationCap size={24} className="text-blue-600" />
                  Education
                </h2>
                <div className="space-y-6">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="relative pl-8 border-l-2 border-blue-200">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-lg text-blue-600 font-medium">{edu.institution}</p>
                        {edu.field && (
                          <p className="text-gray-700 mt-1">{edu.field}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {formatMonthYear(edu.startDate)} - {edu.current ? 'Present' : formatMonthYear(edu.endDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {resume.skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 button-hover-effect font-medium shadow-lg"
          >
            <Download size={20} />
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
