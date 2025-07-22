import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";
import ErrorBoundary from './components/error-boundary';
import { AuthProvider } from "./contexts/AuthContext";

function startApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element with id 'root' not found.");
  }

  createRoot(rootElement).render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

startApp();