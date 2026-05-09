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
    // ⚠️ CRÍTICO: refetch retorna { data, error, ... }, não { data, isError }
    // isError não existe na API do tanstack-query, causaria lógica quebrada
    const { data, error } = await refetch();

    if (!error) {
      setUser(data ?? null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, findUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
