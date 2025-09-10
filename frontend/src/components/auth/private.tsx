import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useVerifyCoordinator } from "../../hooks";
import { LoadPage } from "../";

export function Private({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { isCoordinator, isLoading, error } = useVerifyCoordinator();

  useEffect(() => {
    if ((error || !isCoordinator) && !isLoading) navigate("/login");
  }, [error, isCoordinator, isLoading, navigate]);

  if (isLoading || !isCoordinator) return <LoadPage />;

  return <>{children}</>;
}
