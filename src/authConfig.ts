
// Azure AD configuration
export const msalConfig = {
  auth: {
    clientId: "REPLACE_WITH_YOUR_CLIENT_ID", // Replace with your Azure AD app registration client ID
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for the Microsoft Graph API
export const loginRequest = {
  scopes: ["User.Read"]
};

// Microsoft Graph API endpoints
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
