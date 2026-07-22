import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerSW } from 'virtual:pwa-register';

if (typeof window !== "undefined") {
  const savedTheme = window.localStorage.getItem("fundiTheme");
  document.documentElement.setAttribute(
    "data-theme",
    savedTheme === "light" ? "light" : "dark"
  );
}

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);