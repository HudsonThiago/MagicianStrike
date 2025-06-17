import type { ReactNode } from "react";
import { UserProvider } from "./UserContext";
import { AlertProvider } from "./AlertContext";

interface ContextProps {
  children: ReactNode;
}

export const Context = ({children}:ContextProps) => {
  return (
      <UserProvider>
        <AlertProvider>
            {children}
        </AlertProvider>
      </UserProvider>
  );
};