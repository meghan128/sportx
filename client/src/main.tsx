// src/index.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function startApp() {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element with id 'root' not found.");
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();
