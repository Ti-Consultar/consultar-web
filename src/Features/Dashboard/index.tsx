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

function formatPeriod(month: number, year: number) {
  if (!Number.isInteger(month) || month < 1 || month > 12) return undefined;

  const abbreviatedMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  }).format(new Date(year, month - 1, 1));

  return `${abbreviatedMonth.charAt(0).toUpperCase()}${abbreviatedMonth.slice(1)} ${year}`;
}

export function DashboardPage({ year }: DashboardPageProps) {
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
  const panelPeriod = panel ? formatPeriod(panel.dateMonth, year) : undefined;

  return (
    <MainContainer>
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
          period={panelPeriod}
          currency
        />
        <KpiCard
          title="Margem Bruta"
          value={panel?.margemBruta}
          variation={panel?.variacaoMargemBruta}
          period={panelPeriod}
          percent
        />
        <KpiCard
          title="Margem Líquida"
          value={panel?.margemLiquida}
          variation={panel?.variacaoMargemLiquida}
          period={panelPeriod}
          percent
        />
      </Box>

      {/* MARGINS */}
      <MarginCarousel data={margins} />

      <Subtitle>Dinâmica do Capital de Giro</Subtitle>
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
