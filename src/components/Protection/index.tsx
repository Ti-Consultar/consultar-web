import { ReactNode } from "react";
import { Role, usePermission } from "../../contexts/PermissionsContext";

interface ProtectedProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export const Protected = ({ allowedRoles, children }: ProtectedProps) => {
  const { isAuthorized } = usePermission();

  if (!isAuthorized(allowedRoles)) return null;

  return <>{children}</>;
};
