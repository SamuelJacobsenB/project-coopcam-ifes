import { useContext } from "react";
import { MessageContext } from "./context";

export * from "./context";
export * from "./provider";

export const useMessage = () => useContext(MessageContext);
