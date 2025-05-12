
import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, graphConfig } from "../authConfig";

interface UserProfile {
  displayName: string;
  givenName: string;
  surname: string;
  email: string;
  id: string;
  userPrincipalName: string;
  jobTitle?: string;
  businessPhones?: string[];
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  profilePhoto?: string;
}

export function useUserProfile() {
  const { instance, accounts } = useMsal();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accounts.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get token for Microsoft Graph API
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });

        // Call Microsoft Graph API
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${response.accessToken}`);

        const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
          method: "GET",
          headers: headers
        });

        if (graphResponse.ok) {
          const userData = await graphResponse.json();
          setUserProfile(userData);
        } else {
          setError(`Error fetching user profile: ${graphResponse.status}`);
          console.error("Error fetching user profile", await graphResponse.text());
        }
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          // If interaction is required, try to acquire token with popup
          try {
            await instance.acquireTokenPopup(loginRequest);
            // Retry fetching user profile
            fetchUserProfile();
            return;
          } catch (popupError) {
            setError("Authentication error. Please try logging in again.");
            console.error(popupError);
          }
        } else {
          setError("Error fetching user profile. Please try again later.");
          console.error(e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [instance, accounts]);

  return {
    userProfile,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      return fetchUserProfile();
    }
  };
}
