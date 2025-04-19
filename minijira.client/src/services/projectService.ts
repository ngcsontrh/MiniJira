import api from './api';
import { Project, ProjectFilter } from '../models/Project';
import { PageData } from '../models/PageData';

const BASE_URL = '/api/Project';

/**
 * Get projects with optional filtering
 * @param filter Optional filters for projects (pageIndex, pageSize, memberId)
 */
export const getProjects = async (filter?: ProjectFilter): Promise<PageData<Project>> => {
  try {
    const response = await api.get(`${BASE_URL}`, {
      params: filter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a specific project by ID
 * @param id The ID of the project to retrieve
 */
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new project
 * @param project The project data to create
 */
export const createProject = async (project: Project): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/create`, project);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param project The project data with updates
 */
export const updateProject = async (project: Project): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/update`, project);
  } catch (error) {
    console.error(`Error updating project with ID ${project.id}:`, error);
    throw error;
  }
};