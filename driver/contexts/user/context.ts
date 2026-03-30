import { createContext } from "react";
import type { User } from "../../types";

export interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  findUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps,
);
