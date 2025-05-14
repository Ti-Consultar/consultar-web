import { useEffect } from "react";
import { useMainContext } from "../../../contexts/mainContext";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { SecurityCard } from "./SecurityCard";


export const ProfileSecurity = () => {
  const { setBreadcrumbs } = useMainContext();

  useEffect(() => {
    setBreadcrumbs([
      { name: "Início", link: "/grupos" },
      { name: "Perfil", link: "/perfil" },
    ]);
  }, []);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Configurações do Perfil</Title>
        <SecurityCard></SecurityCard>
      </MainContainer>
    </MainTemplate>
  );
};
