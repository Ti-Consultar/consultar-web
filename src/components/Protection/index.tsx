import { ReactNode } from "react";
import { Role, usePermission } from "../../contexts/PermissionsContext";

interface ProtectedProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export const Protected = ({ allowedRoles, children }: ProtectedProps) => {
  const { isAuthorized, isLoading } = usePermission();

  if (isLoading) return null; // ou <Skeleton />, se quiser feedback visual
  if (!isAuthorized(allowedRoles)) return null;

  return <>{children}</>;
};
