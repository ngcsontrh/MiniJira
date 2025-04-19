import api from './api';
import { ProjectMember } from '../models/ProjectMember';

const BASE_URL = '/api/ProjectMember';

/**
 * Get project members for a specific project
 * @param projectId The ID of the project to get members for
 */
export const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  try {
    const response = await api.get(`${BASE_URL}`, {
      params: { projectId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching members for project ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Add a member to a project
 * @param projectMember The project member data to add
 */
export const addProjectMember = async (projectMember: ProjectMember): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/add`, projectMember);
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
};

/**
 * Update a project member (change role)
 * @param projectMember The project member data with updates
 */
export const updateProjectMember = async (projectMember: ProjectMember): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/update`, projectMember);
  } catch (error) {
    console.error(`Error updating project member with ID ${projectMember.id}:`, error);
    throw error;
  }
};

/**
 * Remove a member from a project
 * @param projectMember The project member to remove
 */
export const removeProjectMember = async (projectMember: ProjectMember): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/remove`, projectMember);
  } catch (error) {
    console.error(`Error removing project member with ID ${projectMember.id}:`, error);
    throw error;
  }
};