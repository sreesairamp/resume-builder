import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Trash2, Save, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import { resumeService, type Resume, type Experience, type Education } from '../services/resumeService';
import ProgressIndicator from './ProgressIndicator';
import ResumeTemplates from './ResumeTemplates';
import LivePreview from './LivePreview';

export default function ResumeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Omit<Resume, 'id' | 'created_at' | 'updated_at'>>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    photo: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const resume = await resumeService.getById(id!);
      if (resume) {
        setFormData({
          full_name: resume.full_name,
          email: resume.email,
          phone: resume.phone,
          location: resume.location,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          photo: resume.photo || ''
        });
      }
    } catch (error) {
      toast.error('Failed to load resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && id) {
        await resumeService.update(id, formData);
        toast.success('Resume updated successfully');
      } else {
        await resumeService.create(formData);
        toast.success('Resume created successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update resume' : 'Failed to create resume');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          current: false
        }
      ]
    });
  };

  const removeExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setFormData({
      ...formData,
      experience: formData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false
        }
      ]
    });
  };

  const removeEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setFormData({
      ...formData,
      education: formData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: '' });
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-blue-600 rounded-xl shadow-lg button-hover-effect border border-gray-100"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to List</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-10 animate-fade-in border-2 border-gray-100">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                    <FileText size={28} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                    {isEditMode ? 'Edit Resume' : 'Create New Resume'}
                  </h1>
                </div>
                <p className="text-gray-600 text-lg ml-1">
                  Fill in your information to build a professional resume that stands out
                </p>
              </div>

              <ResumeTemplates
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gradient-to-r from-blue-500 to-cyan-500">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Upload size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                  Personal Information
                </h2>
              </div>

              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center gap-6">
                  {formData.photo ? (
                    <div className="relative group">
                      <img
                        src={formData.photo}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-110 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-4 border-dashed border-blue-300 shadow-inner">
                      <Upload size={40} className="text-blue-500" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 shadow-lg button-hover-effect inline-block font-semibold"
                    >
                      {formData.photo ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <p className="text-xs text-gray-600 mt-2 font-medium">JPG, PNG or GIF (max 2MB)</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus-effect"
                  placeholder="Brief overview of your professional background and key strengths..."
                />
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex-grow">
                  Work Experience
                </h2>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 button-hover-effect"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
              <div className="space-y-6">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Currently working here</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))}
                {formData.experience.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No work experience added yet</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex-grow">
                  Education
                </h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 button-hover-effect"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
              <div className="space-y-6">
                {formData.education.map((edu) => (
                  <div key={edu.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          disabled={edu.current}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Currently studying here</span>
                      </label>
                    </div>
                  </div>
                ))}
                {formData.education.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No education added yet</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Skills
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 button-hover-effect"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-blue-600 hover:text-blue-900 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {formData.skills.length === 0 && (
                <p className="text-gray-500 text-center py-4">No skills added yet</p>
              )}
            </section>

            <div className="flex gap-4 pt-8 border-t-2 border-gray-200 mt-8">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 button-hover-effect font-semibold shadow-md hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-xl hover:shadow-2xl button-hover-effect font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 transition-all text-lg"
              >
                <Save size={24} />
                {loading ? 'Saving...' : isEditMode ? 'Update Resume' : 'Create Resume'}
              </button>
            </div>
          </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProgressIndicator formData={formData} />
            <LivePreview formData={formData} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}
