import { LoadingProvider } from "./context/LoadingContext";
import { ToastProvider } from "./context/ToastContext";

export function Provider({ children }: { children: React.ReactNode }) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    throw new Error("Missing Google Client ID");
  }

  if (!import.meta.env.VITE_API_URL) {
    throw new Error("Missing API URL!");
  }
  return (
    <ToastProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </ToastProvider>
  );
}
