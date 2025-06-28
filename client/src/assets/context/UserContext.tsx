import React, { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { AlertType } from '../components/alert/alert';
import type { User } from '../models/User';

export type UserContextType = {
  token?:string
  setToken:(token: string|undefined) => void
  user?:User
  setUser:(user:User|undefined) => void
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const getInitialUser = () => {
  let localUser = sessionStorage.getItem("user")
  if (localUser) {
    const user: User = JSON.parse(localUser) as User;
    if(user){
      return user
    }
    return undefined
  }
};

const getInitialToken = () => {
  return sessionStorage.getItem("token") || undefined;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User|undefined>(getInitialUser());
  const [token, setToken] = useState<string|undefined>(getInitialToken());

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [token, user]);
  
  return (
    <UserContext.Provider value={{ 
      token, setToken,
      user, setUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};