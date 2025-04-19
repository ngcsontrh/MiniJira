import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject
} from '../services/projectService';
import { Project, ProjectFilter } from '../models/Project';
import { handleApiError } from '../services/api';

// Query keys for caching
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: ProjectFilter = {}) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Hook for fetching projects with optional filtering
export const useProjects = (filter?: ProjectFilter) => {
  return useQuery({
    queryKey: projectKeys.list(filter || {}),
    queryFn: () => getProjects(filter),
    staleTime: 0 // Don't cache the results to prevent stale data when filtering
  });
};

// Hook for fetching a single project by ID
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProjectById(id),
    enabled: !!id // Only run the query if we have an ID
  });
};

// Hook for creating a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Project) => createProject(project),
    onSuccess: () => {
      // Invalidate projects list queries to refetch data
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating project:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for updating a project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Project) => updateProject(project),
    onSuccess: (_, variables) => {
      // Invalidate specific project detail query
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id!) });
      // Also invalidate projects list to ensure it reflects the updates
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating project:', handleApiError(error));
      return handleApiError(error);
    }
  });
};