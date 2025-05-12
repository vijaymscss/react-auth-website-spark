
import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";

export function useAuthenticationStatus() {
  const { instance } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has active account
    const activeAccount = instance.getActiveAccount();
    const allAccounts = instance.getAllAccounts();
    
    if (activeAccount || allAccounts.length > 0) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, [instance]);

  return {
    isAuthenticated,
    isLoading
  };
}
