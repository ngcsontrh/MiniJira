import api from './api';
import { Issue, IssueFilter } from '../models/Issue';
import { PageData } from '../models/PageData';

const BASE_URL = '/api/Issue';

/**
 * Get issues with optional filtering
 * @param filter Optional filters for issues (type, priority, status, etc.)
 */
export const getIssues = async (filter?: IssueFilter): Promise<PageData<Issue>> => {
  try {
    const response = await api.get(`${BASE_URL}`, {
      params: filter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

/**
 * Get a specific issue by ID
 * @param id The ID of the issue to retrieve
 */
export const getIssueById = async (id: string): Promise<Issue> => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new issue
 * @param issue The issue data to create
 * @returns void - Returns 201 Created status code with no content
 */
export const createIssue = async (issue: Issue): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/create`, issue);
    // Status code 201 (Created) is returned with no data
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
};

/**
 * Update an existing issue
 * @param issue The issue data with updates
 * @returns void - Returns 204 No Content status code
 */
export const updateIssue = async (issue: Issue): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/update`, issue);
    // Status code 204 (No Content) is returned
  } catch (error) {
    console.error(`Error updating issue with ID ${issue.id}:`, error);
    throw error;
  }
};

/**
 * Delete an issue
 * @param issue The issue to delete
 */
export const deleteIssue = async (issue: Issue): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/delete`, issue);
  } catch (error) {
    console.error(`Error deleting issue with ID ${issue.id}:`, error);
    throw error;
  }
};

/**
 * Change the status of an issue
 * @param issue The issue with the updated status
 */
export const changeIssueStatus = async (issue: Issue): Promise<void> => {
  try {
    await api.post(`${BASE_URL}/change-status`, issue);
  } catch (error) {
    console.error(`Error changing status for issue with ID ${issue.id}:`, error);
    throw error;
  }
};

/**
 * Export issues to Excel format
 * @param filter Optional filters for issues (type, priority, status, etc.)
 */
export const exportToExcel = async (filter?: IssueFilter): Promise<void> => {
  try {
    // Get issues with filter applied, or all issues if no filter
    const issues = await getIssues({
      ...filter,
      pageIndex: 1, 
      pageSize: 1000000 // Large page size to get all matching issues
    });
    
    // Import xlsx dynamically
    const XLSX = await import('xlsx');
    
    // Format data for export
    const exportData = issues.items.map(issue => ({
      "Tiêu đề": issue.title,
      "Mô tả": issue.description || '',
      "Trạng thái": issue.status?.replace('_', ' ').toUpperCase() || '',
      "Loại": issue.type ? issue.type.charAt(0).toUpperCase() + issue.type.slice(1) : '',
      "Độ ưu tiên": issue.priority ? issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1) : '',
      "Người được giao": issue.assigneeName || 'Unassigned',
      "Người báo cáo": issue.reporterName || 'N/A',
      "Dự án": issue.projectId || '',
      'Ngày tạo': issue.createdAt ? new Date(issue.createdAt.toString()).toLocaleDateString() : '',
      'Ngày sửa': issue.updatedAt ? new Date(issue.updatedAt.toString()).toLocaleDateString() : '',
    }));
    
    // Create a workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const colWidths: number[] = [];
    exportData.forEach(row => {
      Object.entries(row).forEach(([key, value], colIndex) => {
        const width = Math.max(
          String(key).length,
          String(value).length,
          colWidths[colIndex] || 0
        );
        colWidths[colIndex] = width;
      });
    });
    
    // Apply column widths
    worksheet['!cols'] = colWidths.map(width => ({ width: width + 2 }));
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Issues');
    
    // Generate XLSX file as an array buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Include filter information in filename if filter is present
    const dateStr = new Date().toISOString().split('T')[0];
    const filterStr = filter ? '_filtered' : '';
    link.download = `mini_jira_issues${filterStr}_${dateStr}.xlsx`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};