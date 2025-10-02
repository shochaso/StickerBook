import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@sticker/theme";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container element not found");
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
