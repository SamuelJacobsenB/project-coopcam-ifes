import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LoadPage } from "../";
import { useVerifyCoordinator } from "../../hooks";

export function Private({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { isCoordinator, isLoading, error } = useVerifyCoordinator();

  useEffect(() => {
    if ((error || !isCoordinator) && !isLoading) {
      navigate("/login");
    }
  }, [error, isCoordinator, isLoading, navigate]);

  if (isLoading) return <LoadPage />;

  if (error || !isCoordinator) return null;

  return <>{children}</>;
}
