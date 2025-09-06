import { createContext } from "react";

export type MessageType = "success" | "error";

export interface Message {
  text: string;
  type: MessageType;
}

export interface MessageContextProps {
  message: Message | null;
  showMessage: (text: string, type: MessageType) => void;
  closeMessage: () => void;
}

export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps
);
