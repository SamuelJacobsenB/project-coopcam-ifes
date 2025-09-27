import { useEffect } from "react";

import { router } from "expo-router";

import { LoadPage } from "@/components";

export default function NotFound() {
  useEffect(() => {
    router.replace("/");
  }, []);

  return <LoadPage />;
}
