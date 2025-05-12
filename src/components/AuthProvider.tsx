
import React, { ReactNode } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";
import { useToast } from "@/components/ui/use-toast";

interface AuthProviderProps {
  children: ReactNode;
}

const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if available
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast();

  // Event callbacks
  React.useEffect(() => {
    // Event callback for login success
    const callbackLoginSuccess = (message: EventMessage) => {
      if (message.eventType === EventType.LOGIN_SUCCESS) {
        const result = message.payload as AuthenticationResult;
        msalInstance.setActiveAccount(result.account);
        toast({
          title: "Login successful",
          description: `Welcome, ${result.account?.name}!`,
          variant: "default",
        });
      }
    };

    // Event callback for logout success
    const callbackLogoutSuccess = (message: EventMessage) => {
      if (message.eventType === EventType.LOGOUT_SUCCESS) {
        toast({
          title: "Logout successful",
          description: "You have been signed out.",
          variant: "default",
        });
      }
    };

    // Event callback for errors
    const callbackError = (message: EventMessage) => {
      if (message.eventType === EventType.LOGIN_FAILURE || message.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
        toast({
          title: "Authentication error",
          description: "There was an issue with authentication. Please try again.",
          variant: "destructive",
        });
        console.error(message.error);
      }
    };

    // Register event callbacks
    msalInstance.addEventCallback(callbackLoginSuccess);
    msalInstance.addEventCallback(callbackLogoutSuccess);
    msalInstance.addEventCallback(callbackError);

    return () => {
      // Unregister event callbacks
      msalInstance.removeEventCallback(callbackLoginSuccess);
      msalInstance.removeEventCallback(callbackLogoutSuccess);
      msalInstance.removeEventCallback(callbackError);
    };
  }, [toast]);

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};

export default AuthProvider;
