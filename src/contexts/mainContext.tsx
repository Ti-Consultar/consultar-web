import React, { createContext, useContext, useState } from 'react';
import { BreadcrumbItem } from '../types/breadcrumb';

interface MainProviderType {
  navSelected: string;
  setNavSelected: (navSelected: string) => void;
  company: string;
  setCompany: (company: string) => void;
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

const MainContext = createContext<MainProviderType | undefined>(undefined);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [navSelected, setNavSelected] = useState('Início');
  const [company, setCompany] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <MainContext.Provider
      value={{
        navSelected,
        setNavSelected,
        company,
        setCompany,
        breadcrumbs,
        setBreadcrumbs,
      }}
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
