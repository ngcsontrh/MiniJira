import { useEffect, useState } from 'react';
import { useLogin, useLogout, useRegisterUser } from './useUsers';
import { User, Login } from '../models/User';
import { getCurrentUser, isAuthenticated } from '../services/userService';
import { Token } from '../models/Token';

/**
 * Hook for managing authentication state and providing auth-related functions
 * Uses React Query hooks for API operations and local state for auth status
 */
export const useAuth = () => {
  // Local state for auth status based on token
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());

  // React Query mutations
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegisterUser();

  // Update auth state on mount and when auth changes
  useEffect(() => {
    const currentUser = getCurrentUser();
    const authenticated = isAuthenticated();
    
    setUser(currentUser);
    setIsAuth(authenticated);
  }, []);

  /**
   * Login a user
   * @param credentials Login credentials
   * @returns Promise with the token result
   */
  const login = async (credentials: Login): Promise<Token | undefined> => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      
      // Update local state
      setUser(getCurrentUser());
      setIsAuth(true);
      
      return result;
    } catch {
      return undefined;
    }
  };

  /**
   * Register a new user
   * @param userData The user data for registration
   * @returns Promise indicating success
   */
  const register = async (userData: User): Promise<void> => {
    return registerMutation.mutateAsync(userData);
  };

  /**
   * Logout the current user
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      
      // Update local state
      setUser(null);
      setIsAuth(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isAuth,
    login,
    logout,
    register,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    logoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error
  };
};

export default useAuth;