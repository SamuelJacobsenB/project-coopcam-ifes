import { useCallback, useEffect, useMemo, useState } from "react";

import { useOwnUser } from "../../hooks";
import type { User } from "../../types";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userData, refetch } = useOwnUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const findUser = useCallback(async () => {
    const { data, isError } = await refetch();

    if (!isError) {
      setUser(data ?? null);
    }
  }, [refetch]);

  const value = useMemo(
    () => ({ user, setUser, findUser }),
    [user, findUser],
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};
