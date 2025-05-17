import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  registerUser, 
  loginUser, 
  getUserById,
  getUsers,
  logoutUser,
  changePassword,
  changeRole
} from '../services/userService';
import { User, Login, ChangePassword } from '../models/User';
import { handleApiError } from '../services/api';

// Query keys for caching
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook for fetching users with optional filtering
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => getUsers()
  });
};

// Hook for fetching a single user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id // Only run the query if we have an ID
  });
};

// Hook for user registration
export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: User) => registerUser(user),
    onSuccess: () => {
      // Invalidate users list queries to refetch data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Registration error:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: Login) => loginUser(credentials),
    onSuccess: () => {
      // After login, refresh any relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Login error:', handleApiError(error));
      return handleApiError(error);
    }
  });
};

// Hook for user logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => {
      logoutUser();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear user-related cache after logout
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Reset entire cache when user logs out
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', handleApiError(error));
    }
  });
};

// Hook for changeing user password
export const useChangePassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ChangePassword) => changePassword(data),
    onSuccess: () => {
      // Invalidate user-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Change password error:', handleApiError(error));
      return handleApiError(error);
    }
  });
}

// Hook for change user role
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { userId: string; role: string }) => changeRole({id: params.userId, role: params.role}),
    onSuccess: () => {
      // Invalidate user-related queries to refresh data
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Change user role error:', handleApiError(error));
      return handleApiError(error);
    }
  });
};