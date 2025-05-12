
import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuthenticationStatus } from "@/hooks/useAuthenticationStatus";
import { MicrosoftLogo } from "@/components/icons/MicrosoftLogo";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  // Auto-login function
  useEffect(() => {
    const handleAutoLogin = async () => {
      if (!isLoading && !isAuthenticated) {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (error) {
          console.error("Auto login failed:", error);
        }
      }
    };

    handleAutoLogin();
  }, [instance, isAuthenticated, isLoading]);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Manual login button as fallback
  const handleManualLogin = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="shadow-lg animate-fadeIn">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-azure-600">Welcome</CardTitle>
            <CardDescription className="text-lg">
              Redirecting you to sign in...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-6">
                If you're not automatically redirected, please click the button below.
              </p>
              <Button 
                onClick={handleManualLogin} 
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
