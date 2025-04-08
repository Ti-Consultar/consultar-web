import { createContext, useContext, useState, ReactNode } from "react";
import { SpinnerLoading } from "../../components/SpinnerLoading";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, text?: string) => void;
  loadingText?: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);

  const setLoading = (loading: boolean, text?: string) => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingText }}>
      {isLoading && <SpinnerLoading text={loadingText} />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
