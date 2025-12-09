import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DecodedToken {
  unique_name: string;
  roles: string[];
  permissions: string[];
  exp: number;
  [key: string]: any;
}

interface AuthContextValue {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
    toast.success("Sessão encerrada");
  };

  const loadUserFromToken = () => {
    const token = Cookies.get("token");
    if (!token) return logout();

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Token expirado
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expirado");
        logout();
        return;
      }

      setUser(decoded);
    } catch (err) {
      console.error("Erro ao decodificar o token:", err);
      logout();
    }
  };

  // Login: salva token e recalcula user
  const login = (token: string) => {
    Cookies.set("token", token, { expires: 3 }); // 3 dias, ajuste se quiser
    loadUserFromToken();
    navigate("/grupos");
  };

  // Carrega user ao iniciar a aplicação
  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
