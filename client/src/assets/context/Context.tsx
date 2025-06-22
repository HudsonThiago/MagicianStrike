import type { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { AlertProvider } from "./AlertContext";
import { SocketProvider } from "./socketContext";

interface ContextProps {
  children: ReactNode;
}

export const Context = ({children}:ContextProps) => {
  return (
    <SocketProvider url="http://localhost:3000" options={{ transports: ['websocket'] }}>
      <UserProvider>
        <AlertProvider>
            {children}
        </AlertProvider>
      </UserProvider>
    </SocketProvider>
  );
};