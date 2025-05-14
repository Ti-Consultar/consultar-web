import { Box, Grid2 } from "@mui/material";
import { MainContainer, Title } from "./styles";
import { ProfileOptions } from "../../ProfileOptions";
import { ChangePassword } from "./ChangePassword";

export const SecurityCard = () => {
  return (
    <MainContainer>
      <Grid2 container>
        <Grid2>
          <ProfileOptions />
        </Grid2>
      </Grid2>
      <Box sx={{ margin: "2rem", width: "100%" }}>
        <Title>Segurança da Conta</Title>
        <ChangePassword />
      </Box>
    </MainContainer>
  );
};
