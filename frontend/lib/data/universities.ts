import apiClient from '../api'

export interface University {
  id: number
  name: string
  thumbnail: string | null
  location: string
  established: number
  students: number
  ranking: number
}

// API functions for universities
export async function getUniversities(): Promise<University[]> {
  try {
    const universities = await apiClient.get('/v1/universities/');
    return universities;
  } catch (error) {
    console.error('Failed to fetch universities:', error);
    return [];
  }
}

export async function getUniversityById(id: number): Promise<University | null> {
  try {
    const university = await apiClient.get(`/v1/universities/${id}/`);
    return university;
  } catch (error) {
    console.error('Failed to fetch university:', error);
    return null;
  }
}

export async function searchUniversities(query: string): Promise<University[]> {
  try {
    const universities = await getUniversities();
    if (!query) return universities;

    const lowercaseQuery = query.toLowerCase();
    return universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(lowercaseQuery) ||
        uni.location.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Failed to search universities:', error);
    return [];
  }
}
