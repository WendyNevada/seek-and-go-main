import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of user data
interface User {
  id: number;
  email: string;
  role: string;
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
}

// Create the context
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Custom hook to use the context
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

// Provider component
export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to handle user login
  const login = async (credentials: LoginCredentials) => {
    try {
      // Simulate login request using axios
      const response = await axios.post('/login', credentials);

      // Assuming response.data contains user information
      setUser(response.data.user);


      setError(null);
    } catch (error) {
      // Handle errors
      setError('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    // Clear the user data
    setUser(null);
  };

  // Value to be provided by the context
  const contextValue: LoginContextType = {
    user,
    login,
    logout,
    error
  };

  // Provide the context value to its children
  return <LoginContext.Provider value={contextValue}>{children}</LoginContext.Provider>;
};

export default LoginContext;
