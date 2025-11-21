import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router";
import { useDashboardData } from "./useDashboardData";
import { KpiCard } from "../../components/Card/KpiCard";
import { CapitalDynamicsCarousel } from "../Companies/Charts/CapitalDynamicsCarousel";
import { MarginCarousel } from "../Companies/Charts";
import { LiquidityChart } from "../Companies/Charts/VariaveisLiquidez";
import { GestaoPrazoMedioCarousel } from "../Companies/Charts/GestaoPrasoMedioCarousel";
import { MainContainer, Subtitle } from "./styles";

interface DashboardPageProps {
  year: number;
}

export function DashboardPage({year}: DashboardPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { groupId, companyId, subCompanyId } = useParams<{
    groupId: string;
    companyId?: string;
    subCompanyId?: string;
  }>();
  const {
    panel,
    liquidity,
    prazoMedio,
    dinamica,
    margins,
    index,
    next,
    prev,
    setIndex,
  } = useDashboardData({
    groupId,
    companyId,
    subCompanyId,
    year,
  });

  return (
    <MainContainer>
      {/* HEADER */}
      

      <Subtitle>Índices Econômicos</Subtitle>

      {/* KPIS */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          marginBottom: "1rem",
        }}
      >
        <KpiCard
          title="Receita Líquida"
          value={panel?.receitaLiquida}
          variation={panel?.variacaoReceitaLiquida}
          currency
        />
        <KpiCard
          title="Margem Bruta"
          value={panel?.margemBruta}
          variation={panel?.variacaoMargemBruta}
          percent
        />
        <KpiCard
          title="Margem Líquida"
          value={panel?.margemLiquida}
          variation={panel?.variacaoMargemLiquida}
          percent
        />
      </Box>

      {/* MARGINS */}
      <MarginCarousel data={margins} />

      <Subtitle>Gestão Prazo Médio</Subtitle>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          position: "relative",
          gap: 2,
          mb: "1rem",
        }}
      >
        <CapitalDynamicsCarousel
          data={dinamica}
          onPrev={prev}
          onNext={next}
          currentIndex={index}
          onChangeIndex={setIndex}
        />
        <GestaoPrazoMedioCarousel
          data={prazoMedio}
          onPrev={prev}
          onNext={next}
          currentIndex={index}
          onChangeIndex={setIndex}
        />
      </Box>

      <Subtitle>Gestão de Liquidez</Subtitle>
      <LiquidityChart data={liquidity} />
    </MainContainer>
  );
}
