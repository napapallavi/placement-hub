import {
  User, Student, Company, Job, Application, Interview, PlacementDrive,
  Notification, AdminStats, StudentStats, RecruiterStats, PlacementReportData, ApplicationStatus
} from '../types';

const API_BASE = 'http://localhost:8000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('ph_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('ph_token', token);
    } else {
      localStorage.removeItem('ph_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('ph_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errDetail = 'An error occurred';
        try {
          const errData = await response.json();
          errDetail = errData.detail || errDetail;
        } catch {
          errDetail = response.statusText;
        }
        throw new Error(errDetail);
      }

      return await response.json();
    } catch (err: any) {
      // If network fails (backend not started yet), return fallback mock data
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.warn(`[Placement Hub API] Offline fallback active for ${endpoint}`);
        return this.handleFallback<T>(endpoint, options);
      }
      throw err;
    }
  }

  // Fallback handlers for full offline preview & testing
  private handleFallback<T>(endpoint: string, options: RequestInit): T {
    // Simulated local storage state
    if (endpoint === '/auth/login') {
      const body = JSON.parse(options.body as string);
      const email = body.email.toLowerCase();
      let role = 'student';
      let name = 'Aarav Patel';
      if (email.includes('admin')) {
        role = 'admin';
        name = 'Dr. Ramesh Sharma (Placement Director)';
      } else if (email.includes('recruiter') || email.includes('google') || email.includes('company')) {
        role = 'recruiter';
        name = 'Sarah Jenkins (Google India)';
      }

      const mockUser = {
        id: 1,
        email,
        full_name: name,
        role,
        student_id: role === 'student' ? 1 : undefined,
        roll_number: role === 'student' ? '22CS101' : undefined,
        department: role === 'student' ? 'Computer Science & Engineering' : undefined,
        cgpa: role === 'student' ? 9.12 : undefined,
        company_id: role === 'recruiter' ? 1 : undefined,
        company_name: role === 'recruiter' ? 'Google India' : undefined,
        is_verified: true,
      };
      return { access_token: 'mock-jwt-token-xyz', user: mockUser } as T;
    }

    if (endpoint === '/students/stats') {
      return {
        applied_count: 3,
        under_review_count: 1,
        shortlisted_count: 1,
        interviews_count: 1,
        offers_count: 0,
        profile_completion: 85,
      } as T;
    }

    if (endpoint === '/companies/stats') {
      return {
        active_jobs: 2,
        total_applications: 14,
        shortlisted_candidates: 4,
        scheduled_interviews: 2,
        selected_candidates: 1,
      } as T;
    }

    if (endpoint === '/admin/stats') {
      return {
        total_students: 120,
        placed_students: 94,
        placement_rate: 78.3,
        total_companies: 24,
        total_jobs: 38,
        total_applications: 245,
        highest_package: '44.0 LPA',
        average_package: '12.8 LPA',
        department_stats: [
          { department: 'Computer Science', total: 60, placed: 52, percentage: 86.6 },
          { department: 'Information Technology', total: 30, placed: 24, percentage: 80.0 },
          { department: 'Electronics & Comm.', total: 20, placed: 13, percentage: 65.0 },
          { department: 'Mechanical Eng.', total: 10, placed: 5, percentage: 50.0 },
        ],
        status_distribution: {
          Applied: 45,
          'Under Review': 30,
          Shortlisted: 25,
          'Interview Scheduled': 18,
          Selected: 94,
          Rejected: 33,
        },
        recent_placements: [
          { id: 1, student_name: 'Priya Sharma', roll_number: '22IT104', department: 'Information Technology', company_name: 'Microsoft', package: '28.0 LPA', date: '2026-10-06' },
          { id: 2, student_name: 'Ananya Singh', roll_number: '22CS142', department: 'Computer Science', company_name: 'Google India', package: '32.5 LPA', date: '2026-10-05' },
          { id: 3, student_name: 'Rohan Mehra', roll_number: '22CS118', department: 'Computer Science', company_name: 'Amazon', package: '30.0 LPA', date: '2026-10-03' },
        ],
      } as T;
    }

    if (endpoint === '/admin/reports') {
      return {
        academic_year: '2025-2026',
        generated_at: '2026-10-08',
        total_eligible_students: 120,
        total_offers_made: 109,
        highest_ctc: '44.0 LPA',
        median_ctc: '11.2 LPA',
        average_ctc: '12.8 LPA',
        companies_participated: 24,
        salary_brackets: {
          'Above 20 LPA': 14,
          '12 - 20 LPA': 26,
          '8 - 12 LPA': 38,
          '4 - 8 LPA': 24,
          '< 4 LPA': 7,
        },
        top_recruiters: [
          { name: 'Amazon', hires: 14 },
          { name: 'Google India', hires: 9 },
          { name: 'Microsoft', hires: 8 },
          { name: 'Deloitte', hires: 18 },
          { name: 'TCS Digital', hires: 22 },
        ],
      } as T;
    }

    // Default arrays
    return [] as T;
  }

  // --- Auth APIs ---
  async login(creds: { email: string; password: string }) {
    const data = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(creds),
    });
    this.setToken(data.access_token);
    return data;
  }

  async registerStudent(form: any) {
    const data = await this.request<{ access_token: string; user: User }>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    this.setToken(data.access_token);
    return data;
  }

  async registerRecruiter(form: any) {
    const data = await this.request<{ access_token: string; user: User }>('/auth/register/recruiter', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // --- Student APIs ---
  async getStudentProfile() {
    return this.request<Student>('/students/profile');
  }

  async updateStudentProfile(data: Partial<Student>) {
    return this.request<Student>('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<{ message: string; resume_url: string; file_name: string }>('/students/resume', {
      method: 'POST',
      body: formData,
    });
  }

  async getStudentStats() {
    return this.request<StudentStats>('/students/stats');
  }

  async getEligibleStudents(params?: { department?: string; min_cgpa?: number; skill?: string }) {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.min_cgpa) query.append('min_cgpa', params.min_cgpa.toString());
    if (params?.skill) query.append('skill', params.skill);
    return this.request<Student[]>(`/students/eligible-directory?${query.toString()}`);
  }

  // --- Company & Recruiter APIs ---
  async getCompanyProfile() {
    return this.request<Company>('/companies/profile');
  }

  async updateCompanyProfile(data: Partial<Company>) {
    return this.request<Company>('/companies/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRecruiterStats() {
    return this.request<RecruiterStats>('/companies/stats');
  }

  async getAllCompanies() {
    return this.request<Company[]>('/companies/all');
  }

  // --- Job APIs ---
  async getJobs(params?: { search?: string; department?: string; job_type?: string; min_cgpa?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.department) query.append('department', params.department);
    if (params?.job_type) query.append('job_type', params.job_type);
    if (params?.min_cgpa) query.append('min_cgpa', params.min_cgpa.toString());
    if (params?.status) query.append('status', params.status);
    return this.request<Job[]>(`/jobs?${query.toString()}`);
  }

  async getJobById(id: number) {
    return this.request<Job>(`/jobs/${id}`);
  }

  async getRecruiterJobs() {
    return this.request<Job[]>('/jobs/company/my-jobs');
  }

  async createJob(job: Partial<Job>) {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: number, job: Partial<Job>) {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  }

  async deleteJob(id: number) {
    return this.request<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Application APIs ---
  async applyForJob(jobId: number, coverNote?: string) {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, cover_note: coverNote }),
    });
  }

  async getStudentApplications() {
    return this.request<Application[]>('/applications/my-applications');
  }

  async getJobApplications(jobId: number, status?: string) {
    const query = status ? `?status_filter=${status}` : '';
    return this.request<Application[]>(`/applications/job/${jobId}${query}`);
  }

  async getRecruiterApplications(status?: string) {
    const query = status ? `?status_filter=${status}` : '';
    return this.request<Application[]>(`/applications/recruiter/all${query}`);
  }

  async getAllApplications(status?: string) {
    const query = status ? `?status_filter=${status}` : '';
    return this.request<Application[]>(`/applications/admin/all${query}`);
  }

  async updateApplicationStatus(appId: number, status: ApplicationStatus, feedback?: string) {
    return this.request<Application>(`/applications/${appId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback }),
    });
  }

  // --- Interview APIs ---
  async scheduleInterview(data: {
    application_id: number;
    interview_date: string;
    interview_mode: string;
    meeting_link_or_venue: string;
    round_name: string;
    feedback?: string;
  }) {
    return this.request<Interview>('/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyInterviews() {
    return this.request<Interview[]>('/interviews/my-schedule');
  }

  // --- Placement Drives ---
  async getPlacementDrives(status?: string) {
    const query = status ? `?status_filter=${status}` : '';
    return this.request<PlacementDrive[]>(`/drives${query}`);
  }

  async createPlacementDrive(data: Partial<PlacementDrive>) {
    return this.request<PlacementDrive>('/drives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlacementDrive(id: number, data: Partial<PlacementDrive>) {
    return this.request<PlacementDrive>(`/drives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlacementDrive(id: number) {
    return this.request<{ message: string }>(`/drives/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Admin APIs ---
  async getAdminStats() {
    return this.request<AdminStats>('/admin/stats');
  }

  async getAdminStudents(params?: { department?: string; placed?: boolean }) {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.placed !== undefined) query.append('placed', params.placed.toString());
    return this.request<Student[]>(`/admin/students?${query.toString()}`);
  }

  async updateStudentPlacement(studentId: number, isPlaced: boolean, company?: string) {
    return this.request<{ message: string }>(`/admin/students/${studentId}/placement-status`, {
      method: 'PUT',
      body: JSON.stringify({ is_placed: isPlaced, current_company: company }),
    });
  }

  async verifyCompany(companyId: number, isVerified: boolean) {
    return this.request<{ message: string }>(`/admin/companies/${companyId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ is_verified: isVerified }),
    });
  }

  async getPlacementReports() {
    return this.request<PlacementReportData>('/admin/reports');
  }

  // --- Notifications ---
  async getNotifications() {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationRead(id: number) {
    return this.request<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request<{ message: string }>('/notifications/read-all', {
      method: 'PUT',
    });
  }
}

export const api = new ApiClient();
