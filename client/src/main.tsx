import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from './components/error-boundary';

function startApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element with id 'root' not found.");
  }

  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

startApp();