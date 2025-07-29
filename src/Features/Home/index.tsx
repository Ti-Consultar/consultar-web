import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { useMainContext } from "../../contexts/mainContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

interface UserData {
  exp: number;
  iat: number;
  ip: string;
  role: string;
  unique_name: string;
  userId: string;
}

export const MrpHome = () => {
  const { setBreadcrumbs } = useMainContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs([{ name: "Inicio", link: "/dashboard" }]);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }
  const greeting = getGreeting();

  return (
    <MainTemplate>
      <MainContainer>
        <Title>{greeting}, {userData?.unique_name}</Title>
      </MainContainer>
    </MainTemplate>
  );
};
