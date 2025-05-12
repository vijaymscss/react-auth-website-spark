
import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, User, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMsal } from "@azure/msal-react";

const Profile: React.FC = () => {
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-azure-600">Your Profile</h1>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
              <Button onClick={refetch} variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              User Information
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="text-azure-600 border-azure-200 hover:bg-azure-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}
            </CardTitle>
            <CardDescription>Your Azure AD account details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            ) : (
              userProfile && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b">
                    <div className="bg-azure-100 text-azure-700 p-6 rounded-full text-2xl font-bold flex items-center justify-center h-16 w-16">
                      {userProfile.displayName.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{userProfile.displayName}</h2>
                      {userProfile.jobTitle && <p className="text-gray-500">{userProfile.jobTitle}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-azure-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p>{userProfile.givenName} {userProfile.surname}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-azure-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{userProfile.userPrincipalName || userProfile.email || "Not available"}</p>
                      </div>
                    </div>

                    {userProfile.businessPhones && userProfile.businessPhones.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-azure-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p>{userProfile.businessPhones[0]}</p>
                        </div>
                      </div>
                    )}

                    {userProfile.officeLocation && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-azure-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Office Location</p>
                          <p>{userProfile.officeLocation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mt-4">
                    <p className="text-sm text-gray-500">Azure AD User ID</p>
                    <p className="font-mono text-sm break-all">{userProfile.id}</p>
                  </div>
                </div>
              )
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
