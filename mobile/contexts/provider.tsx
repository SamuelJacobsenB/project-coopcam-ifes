import { MessageProvider, UserProvider } from "./";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MessageProvider>
      <UserProvider>{children}</UserProvider>
    </MessageProvider>
  );
}
