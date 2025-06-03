import { Box, Grid2 } from "@mui/material";
import { MainContainer, Title } from "./styles";
import { ProfileOptions } from "../ProfileOptions";
import { ProfileCard } from "./ProfileCard";

interface ProfileSettingProps {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  onSave?: () => void;
  onEdit?: () => void;
}

export const ProfileSettings = ({
  name,
  role,
  email,
  phoneNumber,
  onSave,
  onEdit,
}: ProfileSettingProps) => {
  return (
    <MainContainer>
      <Grid2 container>
        <Grid2>
          <ProfileOptions />
        </Grid2>
      </Grid2>
      <Box sx={{ margin: "2rem", width: "100%" }}>
        <Title>Informações do Perfil</Title>
        <ProfileCard
          email={email}
          name={name}
          role={role}
          contact={phoneNumber}
          onEdit={onEdit}
          onSave={onSave}
        />
      </Box>
    </MainContainer>
  );
};
