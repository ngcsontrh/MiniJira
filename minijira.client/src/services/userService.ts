import api from './api';
import { ChangePassword, User } from '../models/User';
import { Login } from '../models/User';
import { Token } from '../models/Token';

const TOKEN_KEY = 'minijira_token';
const API_URL = '/api/User';

/**
 * Register a new user
 * @param user The user data for registration
 * @returns Promise with the registration result
 */
export const registerUser = async (user: User): Promise<void> => {
  await api.post(`${API_URL}/register`, user);
};

/**
 * Login a user
 * @param credentials Login credentials
 * @returns Promise with the token result
 */
export const loginUser = async (credentials: Login): Promise<Token> => {
  const response = await api.post<Token>(`${API_URL}/login`, credentials);
  const token = response.data;
  
  // Save token to localStorage
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  
  return token;
};

/**
 * Get the current user from localStorage
 * @returns The current user data or null if not logged in
 */
export const getCurrentUser = (): User | null => {
  const tokenStr = localStorage.getItem(TOKEN_KEY);
  if (tokenStr) {
    const token = JSON.parse(tokenStr) as Token;
    return {
      id: token.userId,
      username: token.username,
      email: token.useremail,
      role: token.userRole
    };
  }
  return null;
};

/**
 * Logout the current user
 */
export const logoutUser = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if user is logged in
 * @returns Boolean indicating if user is logged in
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Get user by ID
 * @param id User ID
 * @returns Promise with the user data
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Get users with optional filtering
 * @param filter Optional filter parameters
 * @returns Promise with the list of users
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(API_URL);
  return response.data;
};

/**
 * Change user password
 * @param username Username of the user
 * @param currentPassword Current password of the user
 * @param newPassword New password to set
 * @returns Promise with the result of the password change
 */
export const changePassword = async (model: ChangePassword): Promise<void> => {
  // Store the current token before password change
  const currentToken = localStorage.getItem(TOKEN_KEY);
  
  // Perform the password change
  await api.post(`${API_URL}/change-password`, model);
  
  // If the backend cleared the token during password change, restore it
  // This ensures the user stays logged in after password change
  if (!localStorage.getItem(TOKEN_KEY) && currentToken) {
    localStorage.setItem(TOKEN_KEY, currentToken);
  }
}