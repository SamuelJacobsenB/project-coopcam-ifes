import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Message, WindowControls } from "./components";
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

// Memoize router configuration to prevent recreating routes on every render
const Router = () => {
  const router = useMemo(
    () =>
      createHashRouter(
        routes.map((route) => ({
          path: route.path,
          element: <route.element />,
        })),
      ),
    [],
  );

  return <RouterProvider router={router} />;
};

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <main id="main">
        <Provider>
          <>
            <Message />
            <WindowControls />
            <Router />
          </>
        </Provider>
      </main>
    </QueryClientProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
