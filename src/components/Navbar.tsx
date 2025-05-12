
import React from "react";
import { useMsal } from "@azure/msal-react";
import { useAuthenticationStatus } from "@/hooks/useAuthenticationStatus";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MicrosoftLogo } from "./icons/MicrosoftLogo";

const Navbar: React.FC = () => {
  const { instance } = useMsal();
  const { isAuthenticated } = useAuthenticationStatus();
  const { userProfile } = useUserProfile();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  // Get initials from name for avatar fallback
  const getInitials = () => {
    if (!userProfile?.displayName) return "?";
    return userProfile.displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <MicrosoftLogo className="h-8 w-8" />
                <span className="font-bold text-xl text-azure-600">Azure AD Demo</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-gray-500 hover:border-azure-500 hover:text-azure-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/profile" 
                className="border-transparent text-gray-500 hover:border-azure-500 hover:text-azure-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="ml-6 flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-gray-500">
                  {userProfile?.displayName || 'User'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-azure-100 text-azure-700">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button onClick={() => window.location.href = '/login'} className="bg-azure hover:bg-azure-600">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
