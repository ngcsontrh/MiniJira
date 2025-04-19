import { Comment } from '../models/Comment';
import api, { handleApiError } from './api';

/**
 * Get all comments for a specific issue
 * @param issueId The ID of the issue to get comments for
 */
export const getCommentsByIssueId = async (issueId: string): Promise<Comment[]> => {
  try {
    const response = await api.get(`/api/comment/issue/${issueId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Add a new comment to an issue
 * @param comment The comment to add
 */
export const addComment = async (comment: Comment): Promise<void> => {
  try {
    await api.post('/api/comment/create', comment);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing comment
 * @param comment The comment with updated data
 */
export const updateComment = async (comment: Comment): Promise<void> => {
  try {
    await api.post('/api/comment/update', comment);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a comment
 * @param commentId The ID of the comment to delete
 */
export const deleteComment = async (comment: Comment): Promise<void> => {
  try {
    await api.delete(`/api/comment/${comment.id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};