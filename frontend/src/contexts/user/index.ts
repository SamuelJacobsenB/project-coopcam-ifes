import { useContext } from "react";
import { UserContext } from "./context";

export * from "./context";
export * from "./provider";

export const useUser = () => useContext(UserContext);
