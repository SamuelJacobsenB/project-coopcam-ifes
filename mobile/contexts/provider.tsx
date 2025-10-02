import { MessageProvider } from "./message";
import { UserProvider } from "./user";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <MessageProvider>
      <UserProvider>{children}</UserProvider>
    </MessageProvider>
  );
}
