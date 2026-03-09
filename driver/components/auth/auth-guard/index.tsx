import { useEffect } from "react";
import { Slot, useSegments, router } from "expo-router";

import { useOwnUser } from "@/hooks";
import { LoadPage } from "../../layout/load-page";

export function AuthGuard() {
  const segments = useSegments();
  const { user, isLoading } = useOwnUser();

  const isAuthRoute = segments[0] === "(auth)";
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoading && !isAuthRoute && !isLoggedIn) {
      router.replace("/(auth)/login");
    }
  }, [isLoading, isAuthRoute, isLoggedIn]);

  if (isLoading || (!isAuthRoute && !isLoggedIn)) {
    return <LoadPage />;
  }

  return <Slot />;
}
