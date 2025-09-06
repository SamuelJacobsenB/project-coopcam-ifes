import { MessageProvider } from "./";

export function Provider({ children }: { children: React.ReactNode }) {
  return <MessageProvider>{children}</MessageProvider>;
}
