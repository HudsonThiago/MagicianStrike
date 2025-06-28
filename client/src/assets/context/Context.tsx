import type { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { AlertProvider } from "./AlertContext";
import { SocketProvider } from "./socketContext";
import { MatrixProvider } from "./matrixContext";

interface ContextProps {
  children: ReactNode;
}

export const Context = ({children}:ContextProps) => {
  return (
    <SocketProvider url="http://localhost:3000" options={{ transports: ['websocket'] }}>
      <UserProvider>
        <AlertProvider>
          <MatrixProvider>
            {children}
          </MatrixProvider>
        </AlertProvider>
      </UserProvider>
    </SocketProvider>
  );
};