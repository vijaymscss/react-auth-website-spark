
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthenticationStatus } from "@/hooks/useAuthenticationStatus";
import { useEffect } from "react";
import { MicrosoftLogo } from "@/components/icons/MicrosoftLogo";

const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      // Login successful, navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg animate-fadeIn">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-azure-600">Welcome</CardTitle>
            <CardDescription className="text-lg">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-6">
                This application demonstrates Azure AD authentication with React 18.
              </p>
              <Button 
                onClick={handleLogin} 
                className="w-full bg-azure hover:bg-azure-600 flex items-center justify-center gap-2 h-12"
              >
                <MicrosoftLogo className="h-5 w-5" />
                <span>Sign in with Microsoft</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Azure AD Authentication Sample</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
