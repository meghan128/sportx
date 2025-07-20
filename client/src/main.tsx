// src/index.tsx
import React from "react";
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
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

startApp();