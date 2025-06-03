import { createContext, useContext, useState, ReactNode } from "react";

type RefreshContextType = {
  shouldRefresh: boolean;
  triggerRefresh: () => void;
  resetRefresh: () => void;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const triggerRefresh = () => setShouldRefresh(true);
  const resetRefresh = () => setShouldRefresh(false);

  return (
    <RefreshContext.Provider
      value={{ shouldRefresh, triggerRefresh, resetRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (): RefreshContextType => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh deve ser usado dentro de RefreshProvider");
  }
  return context;
};
