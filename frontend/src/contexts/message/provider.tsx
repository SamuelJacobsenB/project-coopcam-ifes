import { useCallback, useMemo, useState } from "react";
import { MessageContext, type Message, type MessageType } from "./context";

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = useCallback((text: string, type: MessageType) => {
    setMessage({ text, type });

    const timeoutId = setTimeout(() => {
      setMessage(null);
    }, 6000);

    return timeoutId;
  }, []);

  const closeMessage = useCallback(() => setMessage(null), []);

  const value = useMemo(
    () => ({ message, showMessage, closeMessage }),
    [message, showMessage, closeMessage],
  );

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
