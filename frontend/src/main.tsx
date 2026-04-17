import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Message } from "./components";
import { Provider } from "./contexts";
import { routes } from "./routes";

import "./styles/buttons.css";
import "./styles/colors.css";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  routes.map((route) => {
    return {
      path: route.path,
      element: <route.element />,
    };
  }),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <main className="main">
        <Provider>
          <>
            <Message />
            <RouterProvider router={router} />
          </>
        </Provider>
      </main>
    </QueryClientProvider>
  </StrictMode>,
);
