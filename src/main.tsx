import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from './styles/global.tsx';
import { AppProviders } from './contexts/AppProviders';
import { DrawerProvider } from './contexts/SidebarProvider/index.tsx';
import { CompanyProvider } from './contexts/CompanyProvider/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <CompanyProvider>
        <DrawerProvider>
          <AppProviders>
            <App />
          </AppProviders>
        </DrawerProvider>
      </CompanyProvider>
    </BrowserRouter>
  </React.StrictMode>
);
