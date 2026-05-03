import { useEffect, useState } from "react";

import { useOwnUser } from "../../hooks";
import type { User } from "../../types";
import { UserContext } from "./context";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userData, refetch } = useOwnUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  const findUser = async () => {
    const { data, isError } = await refetch();

    if (!isError) {
      setUser(data ?? null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, findUser }}>
      {children}
    </UserContext.Provider>
  );
};
