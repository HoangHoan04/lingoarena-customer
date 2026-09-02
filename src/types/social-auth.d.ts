declare global {
  interface Window {
    FB?: {
      init: (options: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            accessToken: string;
            expiresIn: number;
            signedRequest: string;
            userID: string;
          };
          status: string;
        }) => void,
        options?: { scope: string },
      ) => void;
      getLoginStatus: (
        callback: (response: {
          status: string;
          authResponse?: {
            accessToken: string;
            expiresIn: number;
            signedRequest: string;
            userID: string;
          };
        }) => void,
      ) => void;
      api: (path: string, params: any, callback: (response: any) => void) => void;
    };
    fbAsyncInit?: () => void;
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export {};
