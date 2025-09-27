import { useEffect, useState } from "react";

import { useSegments, router, Slot } from "expo-router";

import { useVerifyUser } from "@/hooks";
import { LoadPage } from "@/components";

export function AuthGuard() {
  const segments = useSegments();
  const { isVerified, isLoading, error } = useVerifyUser();
  const [redirecting, setRedirecting] = useState(false);

  const isAuthRoute = segments[0] === "(auth)";

  useEffect(() => {
    if (!isLoading && !isAuthRoute && (error || !isVerified) && !redirecting) {
      setRedirecting(true);
      router.replace("/(auth)/login");
    }
  }, [isLoading, isVerified, error, isAuthRoute, redirecting]);

  if (isLoading || (!isAuthRoute && !isVerified)) {
    return <LoadPage />;
  }

  return <Slot />;
}
