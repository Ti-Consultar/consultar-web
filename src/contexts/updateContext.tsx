import { createContext, useContext, useState, ReactNode } from "react";

type GroupUpdateContextType = {
  shouldRefreshGroup: boolean;
  triggerGroupRefresh: () => void;
  resetGroupRefresh: () => void;
};

const GroupUpdateContext = createContext<GroupUpdateContextType | undefined>(
  undefined
);

export const GroupUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRefreshGroup, setShouldRefreshGroup] = useState(false);

  const triggerGroupRefresh = () => setShouldRefreshGroup(true);
  const resetGroupRefresh = () => setShouldRefreshGroup(false);

  return (
    <GroupUpdateContext.Provider
      value={{ shouldRefreshGroup, triggerGroupRefresh, resetGroupRefresh }}
    >
      {children}
    </GroupUpdateContext.Provider>
  );
};

export const useGroupUpdate = (): GroupUpdateContextType => {
  const context = useContext(GroupUpdateContext);
  if (!context) {
    throw new Error(
      "useGroupUpdate deve ser usado dentro de GroupUpdateProvider"
    );
  }
  return context;
};
