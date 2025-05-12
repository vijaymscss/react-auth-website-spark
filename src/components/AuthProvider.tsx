
import React, { ReactNode, useEffect } from "react";
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
  useEffect(() => {
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

    // Register event callbacks and store their IDs
    const loginSuccessCallbackId = msalInstance.addEventCallback(callbackLoginSuccess);
    const logoutSuccessCallbackId = msalInstance.addEventCallback(callbackLogoutSuccess);
    const errorCallbackId = msalInstance.addEventCallback(callbackError);

    return () => {
      // Unregister event callbacks using their IDs
      if (loginSuccessCallbackId) msalInstance.removeEventCallback(loginSuccessCallbackId);
      if (logoutSuccessCallbackId) msalInstance.removeEventCallback(logoutSuccessCallbackId);
      if (errorCallbackId) msalInstance.removeEventCallback(errorCallbackId);
    };
  }, [toast]);

  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};

export default AuthProvider;
