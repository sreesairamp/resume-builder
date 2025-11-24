import axios from 'axios';

const API_URL = 'http://localhost:3001/resumes';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Resume {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

export const resumeService = {
  async getAll(): Promise<Resume[]> {
    const response = await axios.get<Resume[]>(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Resume | null> {
    try {
      const response = await axios.get<Resume>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async create(resume: Omit<Resume, 'id' | 'created_at' | 'updated_at'>): Promise<Resume> {
    const newResume = {
      ...resume,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const response = await axios.post<Resume>(API_URL, newResume);
    return response.data;
  },

  async update(id: string, resume: Partial<Resume>): Promise<Resume> {
    const updatedResume = {
      ...resume,
      updated_at: new Date().toISOString()
    };
    const response = await axios.patch<Resume>(`${API_URL}/${id}`, updatedResume);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};
