import { router, Slot, useSegments } from "expo-router";
import React, { useEffect } from "react";

import { useUser } from "@/contexts";
import { LoadPage } from "../../layout/load-page";

export function AuthGuard() {
  const segments = useSegments();
  const { user, isLoading } = useUser();

  const isAuthRoute = segments[0] === "(auth)";
  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn && !isAuthRoute) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && isAuthRoute) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, isAuthRoute]);

  if (isLoading) {
    return <LoadPage />;
  }

  if (!isLoggedIn && !isAuthRoute) {
    return <LoadPage />;
  }

  return <Slot />;
}
