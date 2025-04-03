import { createContext, useContext, useState, ReactNode } from "react";

interface CompanyContextType {
  companyId: string | null;
  setCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Provedor
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companyId, setCompanyId] = useState<string | null>(null);

  return (
    <CompanyContext.Provider value={{ companyId, setCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
};
