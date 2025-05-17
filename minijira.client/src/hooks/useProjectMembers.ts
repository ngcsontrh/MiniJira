import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProjectMembers,
  addProjectMember,
  updateProjectMember,
  removeProjectMember
} from '../services/projectMemberService';
import { ProjectMember } from '../models/ProjectMember';
import { handleApiError } from '../services/api';

// Query keys for caching
export const projectMemberKeys = {
  all: ['projectMembers'] as const,
  lists: () => [...projectMemberKeys.all, 'list'] as const,
  list: (projectId?: string, memberId?: string) => [...projectMemberKeys.lists(), { projectId, memberId }] as const,
};

// Hook for fetching project members
export const useProjectMembers = (projectId?: string, memberId?: string) => {
  return useQuery({
    queryKey: projectMemberKeys.list(projectId, memberId),
    queryFn: () => getProjectMembers(projectId, memberId),
    enabled: !!projectId  || !!memberId,
  });
};

// Hook for adding a project member
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectMember: ProjectMember) => addProjectMember(projectMember),
    onSuccess: (_, variables) => {
      // Invalidate project members list to refetch data
      queryClient.invalidateQueries({ 
        queryKey: projectMemberKeys.list(variables.projectId!) 
      });
    },
    onError: (error) => {
      console.error('Error adding project member:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for updating a project member
export const useUpdateProjectMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectMember: ProjectMember) => updateProjectMember(projectMember),
    onSuccess: (_, variables) => {
      // Invalidate project members list to refetch data
      queryClient.invalidateQueries({ 
        queryKey: projectMemberKeys.list(variables.projectId!) 
      });
    },
    onError: (error) => {
      console.error('Error updating project member:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for removing a project member
export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (projectMember: ProjectMember) => removeProjectMember(projectMember),
    onSuccess: (_, variables) => {
      // Invalidate project members list to refetch data
      queryClient.invalidateQueries({ 
        queryKey: projectMemberKeys.list(variables.projectId!) 
      });
    },
    onError: (error) => {
      console.error('Error removing project member:', handleApiError(error));
      return handleApiError(error);
    }
  });
};