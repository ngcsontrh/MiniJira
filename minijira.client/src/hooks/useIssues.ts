import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  changeIssueStatus
} from '../services/issueService';
import { Issue, IssueFilter } from '../models/Issue';
import { handleApiError } from '../services/api';

// Query keys for caching
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: IssueFilter = {}) => [...issueKeys.lists(), filters] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  detail: (id: string) => [...issueKeys.details(), id] as const,
};

// Hook for fetching issues with optional filtering
export const useIssues = (filter?: IssueFilter) => {
  return useQuery({
    queryKey: issueKeys.list(filter),
    queryFn: () => getIssues(filter)
  });
};

// Hook for fetching a single issue by ID
export const useIssue = (id: string) => {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => getIssueById(id),
    enabled: !!id // Only run the query if we have an ID
  });
};

// Hook for creating a new issue
export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issue: Issue) => createIssue(issue),
    onSuccess: () => {
      // Invalidate issues list queries to refetch data
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating issue:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for updating an issue
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issue: Issue) => updateIssue(issue),
    onSuccess: (_, variables) => {
      // Invalidate specific issue detail query
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.id!) });
      // Also invalidate issues list to ensure it reflects the updates
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating issue:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for deleting an issue
export const useDeleteIssue = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issue: Issue) => deleteIssue(issue),
    onSuccess: (_, variables) => {
      // Invalidate specific issue detail query
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.id!) });
      // Also invalidate issues list to ensure it reflects the deletion
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting issue:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for changing issue status
export const useChangeIssueStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (issue: Issue) => changeIssueStatus(issue),
    onSuccess: (_, variables) => {
      // Invalidate specific issue detail query
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.id!) });
      // Also invalidate issues list to ensure it reflects the status change
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
    onError: (error) => {
      console.error('Error changing issue status:', handleApiError(error));
      return handleApiError(error);
    }
  });
};