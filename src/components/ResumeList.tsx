import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileText, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { resumeService, type Resume } from '../services/resumeService';

export default function ResumeList() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to load resumes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resumeService.delete(id);
      toast.success('Resume deleted successfully');
      setResumes(resumes.filter(r => r.id !== id));
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete resume');
      console.error(error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-xl text-gray-600">Loading resumes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <FileText size={32} className="text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
                  Resume Builder
                </span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-1">Create stunning resumes that get you hired</p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-2xl hover:shadow-2xl button-hover-effect font-semibold text-lg transform hover:scale-105 shadow-xl"
          >
            <Plus size={24} className="animate-pulse" />
            Create New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-gray-100">
            <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 p-16 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl mb-6 animate-fade-in shadow-xl">
                  <FileText size={48} className="text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Start Building Your Future</h2>
                <p className="text-blue-50 text-xl mb-8 max-w-2xl mx-auto">
                  Create professional resumes in minutes with our intuitive builder, stunning templates, and real-time preview
                </p>
              </div>
            </div>

            <div className="p-12">
              <div className="text-center mb-10">
                <button
                  onClick={() => navigate('/create')}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-2xl hover:shadow-2xl button-hover-effect font-bold text-xl shadow-xl transform hover:scale-105"
                >
                  <Plus size={28} />
                  Create Your First Resume
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 shadow-lg animate-slide-in hover:shadow-xl transition-all" style={{ animationDelay: '100ms' }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">4+</div>
                  <div className="text-sm font-semibold text-gray-700">Professional Templates</div>
                  <div className="text-xs text-gray-500 mt-1">Choose your style</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-100 shadow-lg animate-slide-in hover:shadow-xl transition-all" style={{ animationDelay: '200ms' }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-3">
                    <Edit size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 mb-2">100%</div>
                  <div className="text-sm font-semibold text-gray-700">Fully Customizable</div>
                  <div className="text-xs text-gray-500 mt-1">Make it yours</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-indigo-100 shadow-lg animate-slide-in hover:shadow-xl transition-all" style={{ animationDelay: '300ms' }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-3">
                    <Eye size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Live</div>
                  <div className="text-sm font-semibold text-gray-700">Real-time Preview</div>
                  <div className="text-xs text-gray-500 mt-1">See as you type</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="bg-white rounded-2xl shadow-xl card-hover-effect p-6 border-2 border-gray-100 animate-fade-in relative overflow-hidden group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity"></div>
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {resume.full_name || 'Untitled Resume'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(resume.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{resume.email || 'N/A'}</span>
                  </div>
                  {resume.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Location:</span>
                      <span className="truncate">{resume.location}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {resume.experience.length} Experience{resume.experience.length !== 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {resume.education.length} Education
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {resume.skills.length} Skills
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => navigate(`/view/${resume.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 button-hover-effect"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit/${resume.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 button-hover-effect"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(resume.id!)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 button-hover-effect"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Resume</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 button-hover-effect"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 button-hover-effect"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
