import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { routes } from "./routes";

import "./styles/index.css";
import "./styles/colors.css";
import "./styles/buttons.css";

const router = createBrowserRouter(
  routes.map((route) => {
    return {
      path: route.path,
      element: <route.element />,
    };
  })
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
