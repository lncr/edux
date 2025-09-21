import apiClient from '../api'

export interface Application {
  id: number
  user: number
  university: number
  university_name?: name
  prior_highest_education: string
  created_at: dateString
  essay: string
  education_document?: string | null
  recommendation_letter?: string | null
  status: string
  target_program?: string
}

// API functions for applications
export async function getApplications(): Promise<Application[]> {
  try {
    const applications = await apiClient.get('/v1/applications/');
    return applications;
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return [];
  }
}

export async function createApplication(applicationData: Omit<Application, 'id'>): Promise<Application | null> {
  try {
    const application = await apiClient.post('/v1/applications/', applicationData);
    return application;
  } catch (error) {
    console.error('Failed to create application:', error);
    return null;
  }
}

export async function getApplicationsByUser(): Promise<Application[]> {
  return getApplications(); // The API already filters by authenticated user
}

export async function getApplicationById(id: number): Promise<Application | null> {
  try {
    const application = await apiClient.get(`/v1/applications/${id}/`);
    return application;
  } catch (error) {
    console.error('Failed to fetch application:', error);
    return null;
  }
}
