import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCommentsByIssueId,
  addComment,
  updateComment,
  deleteComment
} from '../services/commentService';
import { Comment } from '../models/Comment';
import { Issue } from '../models/Issue';
import { handleApiError } from '../services/api';

// Query keys for caching
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (issueId: string) => [...commentKeys.lists(), { issueId }] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

// Hook for fetching comments by issue ID
export const useComments = (issueId: string) => {
  return useQuery({
    queryKey: commentKeys.list(issueId),
    queryFn: () => getCommentsByIssueId(issueId),
    enabled: !!issueId // Only run the query if we have an issueId
  });
};

// Hook for adding a comment to an issue
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (comment: Comment) => addComment(comment),
    onSuccess: () => {
      // Invalidate issue detail query to refetch with new comment
      queryClient.invalidateQueries({ 
        queryKey: ['issues', 'detail', commentKeys.lists()] 
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

export const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issue: Issue) => updateComment(issue),
    onSuccess: (_, variables) => {
      // Invalidate specific issue detail query
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(variables.id!),
      });
      // Also invalidate issues list to ensure it reflects the updates
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating issue:", handleApiError(error));
      return handleApiError(error);
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (comment: Comment) => deleteComment(comment),
    onSuccess: (_, variables) => {
      // Invalidate specific issue detail query
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(variables.id!),
      });
      // Also invalidate issues list to ensure it reflects the deletion
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting issue:", handleApiError(error));
      return handleApiError(error);
    },
  });
};
