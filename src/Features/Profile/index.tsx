import { useEffect } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { useMainContext } from "../../contexts/mainContext";
import { ProfileSettings } from "./ProfileSettings";
import { Title, MainContainer } from "./styles";

export const ProfileInfo = () => {
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
        <ProfileSettings></ProfileSettings>
      </MainContainer>
    </MainTemplate>
  );
};
