
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthenticationStatus } from "@/hooks/useAuthenticationStatus";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const { instance } = useMsal();

  useEffect(() => {
    const handleAutoLogin = async () => {
      if (!isLoading && !isAuthenticated) {
        try {
          // Redirect to Microsoft login page
          await instance.loginRedirect(loginRequest);
        } catch (error) {
          console.error("Auto login failed:", error);
        }
      }
    };

    handleAutoLogin();
  }, [isAuthenticated, isLoading, instance]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
