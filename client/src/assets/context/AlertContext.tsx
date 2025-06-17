import React, { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { AlertType } from '../components/alert/alert';

type AlertContextType = {
  visible:boolean
  setVisible:Dispatch<SetStateAction<boolean>>;
  message:string
  setMessage:Dispatch<SetStateAction<string>>;
  type:AlertType
  setType:Dispatch<SetStateAction<AlertType>>;
  title:string
  setTitle:Dispatch<SetStateAction<string>>;
};

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

type AlertProviderProps = {
  children: ReactNode;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<AlertType>('info');
  const [title, setTitle] = useState<string>('');
    
  return (
    <AlertContext.Provider value={{ 
      visible, setVisible,
      message, setMessage,
      type, setType,
      title, setTitle,
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};