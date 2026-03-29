import "@/assets/styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import AppRouter from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <LoadingProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </LoadingProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}
