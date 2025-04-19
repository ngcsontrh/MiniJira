import api from './api';
import { Attachment } from '../models/Attachment';

const BASE_URL = '/api/Attachment';

/**
 * Get all attachments metadata for a specific issue
 * @param issueId The ID of the issue to get attachments for
 */
export const getAttachmentsByIssueId = async (issueId: string): Promise<Attachment[]> => {
  try {
    const response = await api.get(`${BASE_URL}`, {
      params: { issueId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attachments:', error);
    throw error;
  }
};

/**
 * Download an attachment file by ID
 * This returns the actual file blob for download or display
 * @param id The ID of the attachment to download
 * @param fileName Optional name to save the file as
 */
export const downloadAttachment = async (id: string, fileName?: string): Promise<Blob> => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`, {
      responseType: 'blob'
    });
    
    // If we have a fileName, trigger a browser download
    if (fileName) {
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error downloading attachment with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get an attachment URL that can be used in an <img> tag or as a download link
 * @param id The ID of the attachment
 */
export const getAttachmentUrl = (id: string): string => {
  return `${BASE_URL}/${id}`;
};

/**
 * Upload a file as an attachment
 * @param file The file to upload
 * @param issueId Issue ID to associate the attachment with
 */
export const uploadAttachment = async (file: File, issueId?: string): Promise<Attachment> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add issueId to the form data if provided
    if (issueId) {
      formData.append('issueId', issueId);
    }
    
    const response = await api.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

/**
 * Upload multiple files as attachments
 * @param files Array of files to upload
 * @param issueId Issue ID to associate the attachments with
 */
export const uploadMultipleAttachments = async (files: File[], issueId?: string): Promise<Attachment[]> => {
  try {
    const uploadPromises = files.map(file => uploadAttachment(file, issueId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple attachments:', error);
    throw error;
  }
};