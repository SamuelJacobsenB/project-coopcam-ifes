import { useEffect, useState } from "react";

import { UserContext } from "./context";

import { useOwnUser } from "@/hooks";
import type { User } from "@/types";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userData, refetch } = useOwnUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  const findUser = async () => {
    const { data, isError } = await refetch();
    if (!isError) {
      setUser(data);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, findUser }}>
      {children}
    </UserContext.Provider>
  );
};
