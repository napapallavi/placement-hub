export type UserRole = 'student' | 'recruiter' | 'admin';

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export type InterviewMode = 'Online' | 'In-Person';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  student_id?: number;
  roll_number?: string;
  department?: string;
  cgpa?: number;
  resume_url?: string;
  company_id?: number;
  company_name?: string;
  is_verified?: boolean;
}

export interface Student {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  roll_number: string;
  department: string;
  cgpa: number;
  graduation_year: number;
  phone?: string;
  skills?: string;
  resume_url?: string;
  is_placed: boolean;
  current_company?: string;
  bio?: string;
}

export interface Company {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  website?: string;
  location: string;
  contact_email: string;
  description?: string;
  is_verified: boolean;
  created_at?: string;
  active_jobs_count?: number;
}

export interface Job {
  id: number;
  company_id: number;
  company_name?: string;
  company_location?: string;
  title: string;
  description: string;
  department_eligibility: string;
  min_cgpa: number;
  salary_package: string;
  location: string;
  job_type: string;
  deadline?: string;
  status: 'Open' | 'Closed';
  created_at: string;
  applications_count?: number;
  has_applied?: boolean;
  application_status?: ApplicationStatus;
}

export interface Interview {
  id: number;
  application_id: number;
  interview_date: string;
  interview_mode: InterviewMode;
  meeting_link_or_venue: string;
  round_name: string;
  feedback?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  created_at?: string;
  student_name?: string;
  student_roll?: string;
  job_title?: string;
  company_name?: string;
}

export interface Application {
  id: number;
  job_id: number;
  student_id: number;
  status: ApplicationStatus;
  cover_note?: string;
  applied_at: string;
  updated_at: string;
  job_title?: string;
  company_name?: string;
  company_location?: string;
  salary_package?: string;
  student_name?: string;
  student_email?: string;
  student_roll?: string;
  student_cgpa?: number;
  student_department?: string;
  student_skills?: string;
  resume_url?: string;
  interviews?: Interview[];
}

export interface PlacementDrive {
  id: number;
  title: string;
  description?: string;
  company_id?: number;
  company_name?: string;
  drive_date: string;
  venue: string;
  eligibility_criteria: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  created_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning' | 'interview' | 'alert';
  created_at: string;
}

export interface AdminStats {
  total_students: number;
  placed_students: number;
  placement_rate: number;
  total_companies: number;
  total_jobs: number;
  total_applications: number;
  highest_package: string;
  average_package: string;
  department_stats: {
    department: string;
    total: number;
    placed: number;
    percentage: number;
  }[];
  status_distribution: Record<string, number>;
  recent_placements: {
    id: number;
    student_name: string;
    roll_number: string;
    department: string;
    company_name: string;
    package: string;
    date: string;
  }[];
}

export interface StudentStats {
  applied_count: number;
  under_review_count: number;
  shortlisted_count: number;
  interviews_count: number;
  offers_count: number;
  profile_completion: number;
}

export interface RecruiterStats {
  active_jobs: number;
  total_applications: number;
  shortlisted_candidates: number;
  scheduled_interviews: number;
  selected_candidates: number;
}

export interface PlacementReportData {
  academic_year: string;
  generated_at: string;
  total_eligible_students: number;
  total_offers_made: number;
  highest_ctc: string;
  median_ctc: string;
  average_ctc: string;
  companies_participated: number;
  salary_brackets: Record<string, number>;
  top_recruiters: {
    name: string;
    hires: number;
  }[];
}
