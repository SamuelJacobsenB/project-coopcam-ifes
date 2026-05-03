import React, { useEffect, useState } from "react";

import { useOwnUser } from "@/hooks/user/useOwnUser";
import type { User } from "@/types";

import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userData, isLoading, refetch } = useOwnUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(userData ?? null);
  }, [userData]);

  const findUser = async () => {
    const { data, isError } = await refetch();

    if (!isError) {
      setUser(data ?? null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, findUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
