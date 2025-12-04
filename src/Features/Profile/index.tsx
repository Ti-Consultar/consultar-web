import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import { useMainContext } from "../../contexts/mainContext";
import { ProfileSettings } from "./ProfileSettings";
import { Title, MainContainer } from "./styles";
import { useLoading } from "../../contexts/LoadingProvider";
import { getProfileInfo } from "../../services/apis/routes/profile.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { toast } from "sonner";
import { ProfileInformation } from "../../types/profile";

const ProfileInfo = () => {
  const { setBreadcrumbs } = useMainContext();
  const { setLoading } = useLoading();
  const userData = useAuth();

  const [profileInfo, setProfileInfo] = useState<ProfileInformation | null>(
    null
  );

  useEffect(() => {
    setBreadcrumbs([
      { name: "Início", link: "/grupos" },
      { name: "Perfil", link: "/perfil" },
    ]);
  }, []);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      setLoading(true, "Carregando informações de usuário...");
      try {
        if (userData?.userId) {
          const response = await getProfileInfo();
          setProfileInfo(response);
        }
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          toast.error(error.message);
        } else {
          toast.error("Erro ao buscar os grupos.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileInfo();
  }, [userData]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Configurações do Perfil</Title>
        {profileInfo ? (
          <ProfileSettings
            name={profileInfo.name}
            email={profileInfo.email}
            role={profileInfo.role}
            phoneNumber={profileInfo.contact}
          />
        ) : null}
      </MainContainer>
    </MainTemplate>
  );
};

export default ProfileInfo;
