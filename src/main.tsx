import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./locales/i18n";
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  throw new Error("Missing Google Client ID");
}

if (!import.meta.env.VITE_API_URL) {
  throw new Error("Missing  API URL!");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
