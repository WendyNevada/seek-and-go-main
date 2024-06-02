import axiosClient from '@/axios.client';
import { toast } from '@/components/ui/use-toast';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of user data
interface User {
  account_id: number;
  customer_id: number;
  agency_id: number;
  role: string;
  account_name: string;
}

// Define the shape of login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Define the shape of the context
interface LoginContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  navigateTo: (path: string) => void;
}

// Create the context
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Custom hook to use the context
export const useLogin = (path?:string) => {
    const context = useContext(LoginContext);

    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }

    if (path) {
      context.navigateTo(path);
    }

    return context;
};

// Provider component
export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        handleNavigation(parsedUser);
    }
}, []);

  // Function to handle user login
  const login = async (credentials: LoginCredentials) => {
    try {
      // Simulate login request using axios
      const response = await axiosClient.post('/v1/Login', credentials);

      const userData: User = {
        account_id: response.data.account_id,
        customer_id: response.data.customer_id,
        agency_id: response.data.agency_id,
        role: response.data.role,
        account_name: response.data.account_name
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setError(null);
      handleNavigation(userData);

      if(response.data.role == 'Customer'){
        navigate('/');
      }
      else{
        navigate('/Agency');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      // Handle errors
        toast({
            variant: "destructive",
            description: error.response.data.message,
        });
    setError('Login failed. Please check your credentials.');
    }
  };

  const handleNavigation = (userData?: User | null, path?: string) => {
    if (path) {
        navigate(path);
    }
    // else if (userData?.role === "Agency") {
    //     navigate('/Agency');
    // }
  };

  const logout = () => {
    // Clear the user data from localStorage
    localStorage.removeItem('user');
    // Clear the user data
    setUser(null);
    navigate('/');
  };

//   const navigatedTo = (path: string) => {
//     // Store the last visited route in localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const userData: User = JSON.parse(storedUser);
//       localStorage.setItem(`${userData.role}-lastVisitedRoute`, path);
//     }
//     navigate(path);
//   };

  // Value to be provided by the context
  const contextValue: LoginContextType = {
    user,
    login,
    logout,
    error,
    navigateTo: (path: string) => handleNavigation(user, path)
  };

  // Provide the context value to its children
  return <LoginContext.Provider value={contextValue}>{children}</LoginContext.Provider>;
};

export default LoginContext;
