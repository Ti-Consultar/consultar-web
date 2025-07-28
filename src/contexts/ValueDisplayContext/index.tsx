import React, { createContext, useContext, useEffect, useState } from "react";

type ValueDisplayMode = "TOTAL" | "MILHAR" | "MILHARES";

interface ValueDisplayContextType {
  valueMode: ValueDisplayMode;
  setValueMode: (mode: ValueDisplayMode) => void;
}

const STORAGE_KEY = "valueDisplayMode";

const ValueDisplayContext = createContext<ValueDisplayContextType | undefined>(
  undefined
);

export const ValueDisplayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [valueMode, setValueModeState] = useState<ValueDisplayMode>("TOTAL");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ValueDisplayMode;
    if (saved) setValueModeState(saved);
  }, []);

  const setValueMode = (mode: ValueDisplayMode) => {
    setValueModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return (
    <ValueDisplayContext.Provider value={{ valueMode, setValueMode }}>
      {children}
    </ValueDisplayContext.Provider>
  );
};

export const useValueDisplay = () => {
  const context = useContext(ValueDisplayContext);
  if (!context) {
    throw new Error("useValueDisplay must be used inside ValueDisplayProvider");
  }
  return context;
};
