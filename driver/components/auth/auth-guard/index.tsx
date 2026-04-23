import { Redirect, useSegments } from "expo-router";

import { useVerifyDriver } from "@/hooks";

import { LoadPage } from "../../layout/load-page";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const isAuthRoute = segments[0] === "(auth)";

  const { isVerified, isLoading } = useVerifyDriver();

  if (isLoading) return <LoadPage />;

  if (!isVerified && !isAuthRoute) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isVerified && isAuthRoute) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
