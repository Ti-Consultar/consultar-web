import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getAuthToken,
  removeAuthToken,
  setAuthTokenCookie,
} from "../../utils/authToken";

interface DecodedToken {
  unique_name: string;
  roles: string[];
  permissions: string[];
  exp: number;
  [key: string]: unknown;
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

  const decodeAndSetUser = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        removeAuthToken();
        setUser(null);
        return;
      }

      setUser(decoded);
    } catch (err) {
      console.error("Erro ao decodificar token", err);
      removeAuthToken();
      setUser(null);
    }
  };

  const login = (token: string) => {
    setAuthTokenCookie(token);
    decodeAndSetUser(token);
    navigate("/grupos");
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    navigate("/login");
    toast.success("Sessão encerrada");
  };

  // Boot da aplicação (uma única responsabilidade)
  useEffect(() => {
    const token = getAuthToken();
    if (token) decodeAndSetUser(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
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
