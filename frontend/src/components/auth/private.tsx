import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LoadPage } from "../";
import { useVerifyAdmin } from "../../hooks";

export function Private({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { isVerified, isLoading, error } = useVerifyAdmin();

  useEffect(() => {
    if ((error || !isVerified) && !isLoading) {
      navigate("/login");
    }
  }, [error, isVerified, isLoading, navigate]);

  if (isLoading) return <LoadPage />;

  if (error || !isVerified) return null;

  return <>{children}</>;
}
