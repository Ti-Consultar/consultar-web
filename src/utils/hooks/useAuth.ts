// hooks/useAuth.ts
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserData {
  userId: string;
}

export function useAuth() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded: UserData = jwtDecode(token);
        setUserData(decoded);
      } catch (err) {
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
