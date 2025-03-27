import React, { ReactNode } from 'react';
import { MainProvider } from '../mainContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <MainProvider>{children}</MainProvider>
  );
};
