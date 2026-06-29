import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { SecurityCard } from "./SecurityCard";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";


const ProfileSecurity = () => {
  useBreadcrumb("profile-security");

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Configurações do Perfil</Title>
        <SecurityCard />
      </MainContainer>
    </MainTemplate>
  );
};

export default ProfileSecurity;
