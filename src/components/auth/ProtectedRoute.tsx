
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // You could add additional checks here, like subscription status
  }, []);

  if (isLoading) {
    // You could add a loading spinner here
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
