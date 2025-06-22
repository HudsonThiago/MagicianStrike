import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { io, type Socket } from 'socket.io-client';

// Tipo para o contexto
type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

// Criar o contexto com valor inicial undefined
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Propriedades esperadas no provedor
type SocketProviderProps = {
  children: ReactNode;
  url: string;
  options?: Parameters<typeof io>[1]; // opções adicionais, como auth
};

// Componente que fornece o contexto
export const SocketProvider: React.FC<SocketProviderProps> = ({ children, url, options }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(url, options);
    socketRef.current = socketInstance;

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    return () => {
      socketInstance.disconnect();
    };
  }, [url, options]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};