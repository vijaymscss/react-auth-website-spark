
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthenticationStatus } from "@/hooks/useAuthenticationStatus";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { MicrosoftLogo } from "@/components/icons/MicrosoftLogo";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthenticationStatus();
  const { userProfile } = useUserProfile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-4xl font-bold text-azure-600">Azure AD Authentication Demo</h1>
          <p className="text-xl text-gray-600">
            A sample React 18 application with Microsoft Azure AD authentication
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-azure-600">Authentication Status</CardTitle>
              <CardDescription>Current login status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-lg">
                  Status: {" "}
                  <span className={isAuthenticated ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                    {isAuthenticated ? "Signed In" : "Signed Out"}
                  </span>
                </p>
                {isAuthenticated && userProfile && (
                  <p className="mt-2">
                    Signed in as: <span className="font-medium">{userProfile.displayName}</span>
                  </p>
                )}
              </div>
              
              {!isAuthenticated && (
                <Button asChild className="w-full bg-azure hover:bg-azure-600">
                  <Link to="/login">
                    <MicrosoftLogo className="mr-2 h-4 w-4" />
                    Sign In with Microsoft
                  </Link>
                </Button>
              )}
              
              {isAuthenticated && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile">
                    View Profile Details
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-azure-600">Azure AD Integration</CardTitle>
              <CardDescription>How this demo works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This application demonstrates how to integrate Azure AD authentication into a React application using 
                the Microsoft Authentication Library (MSAL).
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>User authentication via Microsoft accounts</li>
                <li>Protected routes requiring authentication</li>
                <li>Access to Microsoft Graph API for profile data</li>
                <li>Token management and refresh</li>
                <li>Silent authentication flows</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
