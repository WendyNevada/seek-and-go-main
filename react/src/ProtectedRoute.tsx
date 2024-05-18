// import React from 'react';
// import { Navigate, Route, RouteProps } from 'react-router-dom';
// import { useUserRole } from './context/CustomHook';

// type UserRole = 'Customer' | 'Agency';

// type ProtectedRouteProps = RouteProps & {
//     requiredRole: UserRole;
// };

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, ...rest }) => {
//     const hasRequiredRole = useUserRole(requiredRole);

//     if (!hasRequiredRole) {
//         // Redirect to a different page if user doesn't have required role
//         return <Navigate to="/Login" />;
//     }

//     // Render the route if user has required role
//     return <Route {...rest} />;
// };

// export default ProtectedRoute;
// ProtectedRoute.tsx
// ProtectedRoute.tsx

// ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import LoginContext from './context/LoginContext';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
  requiredRole: 'Customer' | 'Agency';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element, requiredRole }) => {
    const loginContext = useContext(LoginContext);
    const user = loginContext?.user;

  if (!user || user.role !== requiredRole) {
    // Redirect to login if the user is not logged in or doesn't have the required role
    return <Navigate to="/Login" />;
  }

  // Render the route if the user has the required role
  return <Route path={path} element={element} />;
};

export default ProtectedRoute;

