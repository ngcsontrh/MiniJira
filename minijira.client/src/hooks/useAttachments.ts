import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAttachmentsByIssueId,
  downloadAttachment,
  uploadAttachment,
  uploadMultipleAttachments
} from '../services/attachmentService';
import { handleApiError } from '../services/api';

// Query keys for caching
export const attachmentKeys = {
  all: ['attachments'] as const,
  lists: () => [...attachmentKeys.all, 'list'] as const,
  list: (issueId: string) => [...attachmentKeys.lists(), { issueId }] as const,
  details: () => [...attachmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...attachmentKeys.details(), id] as const,
};

// Hook for fetching attachments by issue ID
export const useAttachments = (issueId: string) => {
  return useQuery({
    queryKey: attachmentKeys.list(issueId),
    queryFn: () => getAttachmentsByIssueId(issueId),
    enabled: !!issueId // Only run the query if we have an issueId
  });
};

// Hook for downloading an attachment
export const useDownloadAttachment = () => {
  return useMutation({
    mutationFn: ({ id, fileName }: { id: string, fileName?: string }) => 
      downloadAttachment(id, fileName),
    onError: (error, variables) => {
      console.error(`Error downloading attachment ${variables.id}:`, handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for uploading a single attachment
export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, issueId }: { file: File, issueId?: string }) => 
      uploadAttachment(file, issueId),
    onSuccess: (data, variables) => {
      // If an issueId was provided, invalidate attachments list for that issue
      if (variables.issueId) {
        queryClient.invalidateQueries({ 
          queryKey: attachmentKeys.list(variables.issueId) 
        });
      }
      // Return the attachment data
      return data;
    },
    onError: (error, variables) => {
      console.error(`Error uploading file ${variables.file.name}:`, handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for uploading multiple attachments
export const useUploadMultipleAttachments = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ files, issueId }: { files: File[], issueId?: string }) => 
      uploadMultipleAttachments(files, issueId),
    onSuccess: (_, variables) => {
      // If an issueId was provided, invalidate attachments list for that issue
      if (variables.issueId) {
        queryClient.invalidateQueries({ 
          queryKey: attachmentKeys.list(variables.issueId) 
        });
      }
    },
    onError: (error) => {
      console.error(`Error uploading multiple files:`, handleApiError(error));
      return handleApiError(error);
    }
  });
};