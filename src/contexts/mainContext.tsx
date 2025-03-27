import React, { createContext, useContext, useState } from 'react';

interface MainProviderType {
  navSelected: string;
  setNavSelected: (navSelected: string) => void;
  company: string;
  setCompany: (company: string) => void;
}
const MainContext = createContext<MainProviderType | undefined>(undefined);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [navSelected, setNavSelected] = useState('Home');
  const [company, setCompany] = useState<string>('');

  return (
    <MainContext.Provider
      value={{ navSelected, setNavSelected, company, setCompany }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainProvider');
  }
  return context;
};
