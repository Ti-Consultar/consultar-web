import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalStyle } from "./styles/global.tsx";
import { AppProviders } from "./contexts/AppProviders";
import { CompanyProvider } from "./contexts/CompanyProvider/index.tsx";
import { LoadingProvider } from "./contexts/LoadingProvider/index.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styles/theme.ts";
import { RefreshProvider } from "./contexts/refreshContext.tsx";
import { PermissionProvider } from "./contexts/PermissionsContext/index.tsx";
import { ValueDisplayProvider } from "./contexts/ValueDisplayContext/index.tsx";
import { DrawerProvider } from "./contexts/DrawerContext/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <DrawerProvider>
        <BrowserRouter>
          <LoadingProvider>
            <ValueDisplayProvider>
              <RefreshProvider>
                <CompanyProvider>
                  <PermissionProvider>
                    <AppProviders>
                      <App />
                    </AppProviders>
                  </PermissionProvider>
                </CompanyProvider>
              </RefreshProvider>
            </ValueDisplayProvider>
          </LoadingProvider>
        </BrowserRouter>
      </DrawerProvider>
    </ThemeProvider>
  </React.StrictMode>
);
