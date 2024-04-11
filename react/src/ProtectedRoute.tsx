import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useUserRole } from './context/CustomHook';

interface ProtectedRouteProps {
    path: string; // Assuming you're using path prop
    element: React.ReactNode; // Assuming you're using element prop
    requiredRole: 'Customer' | 'Agency';
    // You can include other props as needed
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, ...rest }) => {
  const hasRequiredRole = useUserRole(requiredRole);

  if (!hasRequiredRole) {
    // Redirect to a different page if user doesn't have required role
    return <Navigate to="/Login" />;
  }

  // Render the route if user has required role
  return <Route {...rest} />;
};

export default ProtectedRoute;
