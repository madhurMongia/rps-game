"use client"
import LoadingSpinner from '@/components/shared/loader.styles';
import React, { createContext, useContext, useState } from 'react';

type LoaderContextType = {
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>;
  };
  
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }:Readonly<{
    children: React.ReactNode
  }>) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{setIsLoading }}>
     {isLoading?<LoadingSpinner></LoadingSpinner>: children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
      throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
  };
