import React, { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { enviromentMatrix } from '../utils/enviromentMatrix';

type MatrixContextType = {
  matrix:number[][]
  setMatrix:Dispatch<SetStateAction<number[][]>>;
};

export const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

type MatrixProviderProps = {
  children: ReactNode;
};

export const MatrixProvider: React.FC<MatrixProviderProps> = ({ children }) => {
  const [matrix, setMatrix] = useState<number[][]>(enviromentMatrix);
    
  return (
    <MatrixContext.Provider value={{ 
      matrix, setMatrix,
    }}>
      {children}
    </MatrixContext.Provider>
  );
};

export const useMatrix = (): MatrixContextType => {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
};