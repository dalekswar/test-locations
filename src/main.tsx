import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";


const container = document.querySelector("#root");
if (!container)
  throw new Error("Can't start the application: div#root not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
