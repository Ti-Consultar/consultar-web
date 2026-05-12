// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAuthToken } from "../authToken";

interface UserData {
  userId: string;
}

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();

    if (token) {
      try {
        const decoded: UserData = jwtDecode(token);
        setUserData(decoded);
      } catch {
        toast.error("Sua sessão expirou. Faça login novamente.");
        navigate("/");
      }
    } else {
      navigate("/");
        toast.error("Sua sessão expirou. Faça login novamente.");
    }
  }, []);

  return userData;
}
