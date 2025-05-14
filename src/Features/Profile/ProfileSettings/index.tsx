import { Box, Grid2 } from "@mui/material";
import { MainContainer, Title } from "./styles";
import { ProfileOptions } from "../ProfileOptions";
import { ProfileCard } from "./ProfileCard";

export const ProfileSettings = () => {
  return (
    <MainContainer>
      <Grid2 container>
        <Grid2>
          <ProfileOptions />
        </Grid2>
      </Grid2>
      <Box sx={{ margin: "2rem", width: "100%" }}>
        <Title>Informações do Perfil</Title>
        <ProfileCard></ProfileCard>
      </Box>
    </MainContainer>
  );
};
