import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router";
import DashboardIcon from "../../assets/icons/duo-icons_dashboard.svg";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { useDashboardData } from "./useDashboardData";
import { KpiCard } from "../../components/Card/KpiCard";
import { CapitalDynamicsCarousel } from "../Companies/Charts/CapitalDynamicsCarousel";
import { MarginCarousel } from "../Companies/Charts";
import { LiquidityChart } from "../Companies/Charts/VariaveisLiquidez";
import { GestaoPrazoMedioCarousel } from "../Companies/Charts/GestaoPrasoMedioCarousel";
import { MainContainer, Subtitle, Title } from "./styles";
import { ModernTextField } from "../../styles/DatePicker";

export function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { groupId, companyId, subCompanyId } = useParams<{
    groupId: string;
    companyId?: string;
    subCompanyId?: string;
  }>();

  const [year, setYear] = useState(new Date().getFullYear());
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
      <Box
        sx={{
          display: "flchex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <img src={DashboardIcon} alt="" />
          <Title>Dashboard</Title>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year"]}
            label="Ano"
            value={dayjs().year(year)}
            onChange={(v) => setYear(v?.year() ?? year)}
            enableAccessibleFieldDOMStructure={false}
            slots={{
              textField: ModernTextField,
            }}
            slotProps={{
              textField: { size: "medium" },
            }}
          />
        </LocalizationProvider>
      </Box>

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
