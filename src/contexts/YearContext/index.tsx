import { createContext, useContext, useState } from "react";

interface YearContextType {
  year: number;
  setYear: (year: number) => void;
}

const YearContext = createContext<YearContextType | null>(null);

export function YearProvider({ children }: { children: React.ReactNode }) {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  const context = useContext(YearContext);
  if (!context) throw new Error("useYear must be used inside YearProvider");
  return context;
}
