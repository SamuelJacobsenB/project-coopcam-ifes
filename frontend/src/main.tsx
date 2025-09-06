import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./pages";

import "./styles/index.css";
import "./styles/colors.css";
import "./styles/buttons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
