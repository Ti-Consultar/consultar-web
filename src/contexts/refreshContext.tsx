import { createContext, useContext, useState, ReactNode } from "react";

type RefreshMap = Record<string, number>; // key -> timestamp

type RefreshContextType = {
  refreshMap: RefreshMap;
  triggerRefresh: (key: string) => void;
};

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refreshMap, setRefreshMap] = useState<RefreshMap>({});

  const triggerRefresh = (key: string) => {
    setRefreshMap((prev) => ({
      ...prev,
      [key]: Date.now(), // change value to force update
    }));
  };

  return (
    <RefreshContext.Provider value={{ refreshMap, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (key: string): [number, () => void] => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh deve ser usado dentro de RefreshProvider");
  }

  const { refreshMap, triggerRefresh } = context;
  return [refreshMap[key] ?? 0, () => triggerRefresh(key)];
};
