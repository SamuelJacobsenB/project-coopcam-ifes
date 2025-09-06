import { useState } from "react";
import { MessageContext, type Message, type MessageType } from "./context";

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = (text: string, type: MessageType) => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage(null);
    }, 6000);
  };

  const closeMessage = () => setMessage(null);

  return (
    <MessageContext.Provider value={{ message, showMessage, closeMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
