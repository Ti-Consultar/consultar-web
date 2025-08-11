import { Typography } from "@mui/material";
import { MainTemplate } from "../../../components/AppLayout";
import EvaDiagram from "../../../components/EvaDiagram/EvaDiagram";
import { mockData } from "./mockdata";
import { Header, MainContainer } from "./style";

export const AgregadoMensal = () => {
  return (
    <MainTemplate>
      <MainContainer>
        <Header>
          <Typography>Árvore de Valor EVA - Mensal</Typography>
          <Typography></Typography>
        </Header>
        <EvaDiagram data={mockData}></EvaDiagram>
      </MainContainer>
    </MainTemplate>
  );
};
