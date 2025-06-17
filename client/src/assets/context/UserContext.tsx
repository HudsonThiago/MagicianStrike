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
  let localUser = localStorage.getItem("user")
  if (localUser) {
    const user: User = JSON.parse(localUser) as User;
    if(user){
      return user
    }
    return undefined
  }
};

const getInitialToken = () => {
  return localStorage.getItem("token") || undefined;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User|undefined>(getInitialUser());
  const [token, setToken] = useState<string|undefined>(getInitialToken());

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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