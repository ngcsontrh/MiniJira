import axios, { AxiosError } from 'axios';
import { Token } from '../models/Token';
import { queryClient } from '../utils/QueryProvider';

// Define API error response type
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  title?: string;
  status?: number;
  traceId?: string;
}

// Create axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(config => {
  const tokenStr = localStorage.getItem('minijira_token');
  if (tokenStr) {
    const token = JSON.parse(tokenStr) as Token;
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Ensure we can safely access the status code even if response is undefined
  const status = error.response?.status || 0;
  
  // Handle unauthorized errors (expired token, etc)
  if (status === 401) {
    localStorage.removeItem('minijira_token');
    
    // Clear all queries in the cache to force refetch after login
    queryClient.clear();
    
    // Redirect to login page
    window.location.href = '/login';
  }
  
  // Handle server errors
  if (status >= 500) {
    console.error('Server error:', error.response?.data || 'Unknown server error');
  }
  
  // Add status to the error object if it doesn't exist
  if (!error.status && error.response) {
    error.status = error.response.status;
  }

  return Promise.reject(error);
});

// Export a global error handler for use in React Query
export const handleApiError = (error: unknown): string => {
  // Default error message
  let errorMessage = 'An unexpected error occurred';
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    // Always provide a status, defaulting to 0 if undefined
    const status = axiosError.response?.status || 0;
    
    if (status === 400) {
      errorMessage = 'Invalid request. Please check your data.';
    } else if (status === 401) {
      errorMessage = 'Unauthorized. Please login again.';
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    // If we have a more specific error message in the response, use that
    const responseData = axiosError.response?.data;
    if (responseData) {
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.title) {
        errorMessage = responseData.title;
      } else if (responseData.errors) {
        // Join all error messages
        const allErrors = Object.values(responseData.errors).flat();
        if (allErrors.length > 0) {
          errorMessage = allErrors.join('. ');
        }
      }
    }
  }
  
  return errorMessage;
};

export default api;