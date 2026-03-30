import { Redirect, useSegments } from "expo-router";

import { useUser } from "@/contexts";
import { LoadPage } from "../../layout/load-page";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const { user, isLoading } = useUser();
  const isAuthRoute = segments[0] === "(auth)";

  if (isLoading) return <LoadPage />;

  if (!user && !isAuthRoute) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user && isAuthRoute) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
