import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "../../utils/authToken";

export type Role =
  | "Admin"
  | "Gestor"
  | "Usuario"
  | "Consultor"
  | "Comercial"
  | "Desenvolvedor"
  | "Designer";

interface DecodedPermissionsToken {
  role?: string;
}

interface PermissionContextType {
  role: Role | null;
  isLoading: boolean;
  isAuthorized: (allowedRoles: Role[]) => boolean;
  reloadPermissions: () => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPermissions = () => {
    const token = getAuthToken();

    if (!token) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded: DecodedPermissionsToken = jwtDecode(token);
      const rawRole = decoded?.role?.trim();

      const validRoles: Role[] = [
        "Admin",
        "Gestor",
        "Usuario",
        "Consultor",
        "Comercial",
        "Desenvolvedor",
        "Designer",
      ];

      if (rawRole && validRoles.includes(rawRole as Role)) {
        setRole(rawRole as Role);
      } else {
        console.warn("Role inválida:", rawRole);
        setRole(null);
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const isAuthorized = (allowedRoles: Role[]) => {
    return role ? allowedRoles.includes(role) : false;
  };

  return (
    <PermissionContext.Provider
      value={{
        role,
        isLoading,
        isAuthorized,
        reloadPermissions: loadPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error(
      "usePermission deve ser usado dentro do PermissionProvider"
    );
  }
  return context;
};
