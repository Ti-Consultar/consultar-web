import { Box, Grid2, Typography } from "@mui/material";
import { MainContainer, SectionTitle, Title } from "./styles";
import { ProfileOptions } from "../ProfileOptions";
import { MainTemplate } from "../../../components/AppLayout";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";

export const ProfileCustomizing = () => {
  return (
    <MainTemplate>
      <Title>Configurações do Perfil</Title>
      <MainContainer>
        <Grid2 container>
          <Grid2>
            <ProfileOptions />
          </Grid2>
        </Grid2>
        <Box sx={{ margin: "2rem", width: "100%" }}>
          <SectionTitle>Personalização</SectionTitle>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Typography sx={{ mb: 1 }} fontWeight={"700"}>
              Formatação dos Valores
            </Typography>
            <TableValueVisualization />
          </Box>
        </Box>
      </MainContainer>
    </MainTemplate>
  );
};
