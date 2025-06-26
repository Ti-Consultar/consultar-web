import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export type Role =
  | "Admin"
  | "Gestor"
  | "Usuario"
  | "Consultor"
  | "Comercial"
  | "Desenvolvedor"
  | "Designer";

interface PermissionContextType {
  role: Role | null;
  isAuthorized: (allowedRoles: Role[]) => boolean;
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

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const rawRole = decoded?.role?.trim(); // 👈 remove espaços
        const validRoles: Role[] = [
          "Admin",
          "Gestor",
          "Usuario",
          "Consultor",
          "Comercial",
          "Desenvolvedor",
          "Designer",
        ];

        if (validRoles.includes(rawRole)) {
          setRole(rawRole);
        } else {
          console.warn("Role inválido ou não reconhecido:", rawRole);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, []);

  const isAuthorized = (allowedRoles: Role[]) => {
    return role ? allowedRoles.includes(role) : false;
  };

  return (
    <PermissionContext.Provider value={{ role, isAuthorized }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission deve ser usado dentro do AuthProvider");
  }
  return context;
};
