// Custom hook to check user role
import { useLogin } from '@/context/LoginContext';

type UserRole = 'Customer' | 'Agency'; // Define possible user roles

export const useUserRole = (requiredRole: UserRole): boolean => {
  const { user } = useLogin();
  return user?.role === requiredRole;
};
