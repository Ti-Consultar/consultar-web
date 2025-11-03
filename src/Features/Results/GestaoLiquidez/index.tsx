import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import {
  getCapitalDynamics,
  getCapitalDynamicsVariation,
  getCapitalStructure,
  getCapitalStructureVariation,
  getGrossCashFlow,
  getGrossCashFlowVariation,
  getLiquidity,
  getLiquidityManagement,
  getLiquidityManagementVariation,
  getLiquidityMonth,
  getLiquidityVariation,
  getTurnover,
  getTurnoverVariation,
} from "../../../services/apis/routes/gestaoLiquidez.service";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import FleurietGestaoLiquidezChart from "../../../components/Charts/FleurietChart/FleurietGestaoLiquidezChart";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { GrossCashFlowChart } from "../../../components/Charts/GrossCashFlowChart";
import { CapitalDynamicsChart } from "./charts/CapitalDynamicsChart";
import { CapitalStructureStackedBarChart } from "./charts/CapitalStructureStackedBarChart";
import { useDrawer } from "../../../contexts/DrawerContext";
import TurnoverChart from "./charts/TurnoverChart";
import { LiquidityLineChart } from "./charts/LiquidityLineChart";
import { MonthNavigator } from "../../../components/Inputs/MonthNavigator";
import { LiquidityChart } from "../../Companies/Charts/VariaveisLiquidez";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { ResultsTableVariation } from "../resultsTableVariation";

interface LiquidityMonth {
  name: string;
  dateMonth: number;
  saldoTesouraria: number;
  ncg: number;
  cdg: number;
  indiceDeLiquidez: number;
}

interface LiquidityVariables {
  months: LiquidityMonth[];
}

interface LiquidityData {
  liquidityVariables: LiquidityVariables;
}

export const GestaoLiquidez = () => {
  const [tabValue, setTabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );
  const [months, setMonths] = useState<any[]>([]);
  const [valueMode, setValueMode] = useState<boolean>(true);
  const [metricTypes, setMetricTypes] =
    useState<Record<string, "number" | "percent" | "indicator">>();
  const [metricKeys, setMetricKeys] = useState<string[]>([]);
  const [metricLabels, setMetricLabels] = useState<Record<string, string>>({});
  const { setLoading } = useLoading();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null);
  const [liquidityMonth, setLiquidityMonth] = useState<LiquidityData>();
  const [capitalDynamicsData, setCapitalDynamicsData] = useState<any[]>([]);
  const [grossCashFlowDashData, setGrossCashFlowDashData] = useState<any[]>([]);
  const [capitalStructuresData, setCapitalStructuresData] = useState<any[]>([]);
  const [liquidityVariables, setLiquidityVariables] = useState<any[]>([]);
  const [liquidez, setLiquidez] = useState<any[]>([]);
  const [turnoverData, setTurnoverData] = useState<any[]>([]);
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { isOpen } = useDrawer();

  useEffect(() => {
    const loadSetting = () => {
      const savedSetting = localStorage.getItem("showBudgetColumns");
      setShowBudgetColumns(savedSetting === "true");
    };

    loadSetting();

    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

  useEffect(() => {
    if (!groupId || accountPlanId) return;

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ): Promise<void> => {
      try {
        setLoading(true, "Buscando data...");
        const response = await getAccountPlan(groupId, companyId, subCompanyId);

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const lastItem = data[data.length - 1];
        setAccountPlanId(lastItem.id);
      } catch (error) {
        console.error("Failed to fetch AccountPlanId", error);
        toast.error("Erro ao buscar plano de contas");
      } finally {
        setLoading(false);
      }
    };

    getAccountPlanId(
      Number(groupId),
      companyid ? Number(companyid) : undefined,
      subCompanyId ? Number(subCompanyId) : undefined
    );
  }, [groupId, companyid, subCompanyId, accountPlanId, setLoading]);

  const fetchData = async () => {
    if (!selectedYear) return;

    setLoading(true);
    const year = Number(selectedYear.format("YYYY"));

    try {
      if (!accountPlanId) return;
      let response;
      let dashboardResponse;
      let metrics: string[] = [];
      let labels: Record<string, string> = {};
      let extractedMonths: any[] = [];
      let extractedMonthsFleuriet: any[] = [];

      switch (tabValue) {
        case 1:
          response = await getLiquidityManagementVariation(accountPlanId, year);
          dashboardResponse = await getLiquidityManagement(accountPlanId, year);
          setLiquidityVariables(dashboardResponse?.liquidityVariables?.months);
          extractedMonths = response?.months ?? [];
          extractedMonthsFleuriet =
            dashboardResponse?.liquidityVariables?.months ?? [];
          metrics = ["saldoTesouraria", "ncg", "cdg", "indiceDeLiquidez"];
          labels = {
            saldoTesouraria: "Saldo Tesouraria",
            ncg: "Necessidade de Capital de Giro (NCG)",
            cdg: "Capital de Giro (CDG)",
            indiceDeLiquidez: "Índice de Liquidez (%)",
          };
          setValueMode(true);
          setMetricTypes({
            saldoTesouraria: "number",
            ncg: "number",
            cdg: "number",
            indiceDeLiquidez: "percent",
          });
          break;

        case 2:
          response = await getCapitalDynamicsVariation(accountPlanId, year);
          dashboardResponse = await getCapitalDynamics(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          metrics = [
            "pme",
            "pmr",
            "pmp",
            "cicloFinanceiroDasOperacoesPrincipais",
            "cicloFinanceiroNCG",
          ];
          labels = {
            pme: "(PME) Prazo Médio Estocagem",
            pmr: "(PMR) Prazo Médio Clientes",
            pmp: "(PMP) Prazo Médio Fornecedores",
            cicloFinanceiroDasOperacoesPrincipais:
              "Ciclo Financeiro das Operações",
            cicloFinanceiroNCG: "Ciclo Financeiro NCG",
          };
          setMetricTypes({
            pme: "indicator",
            pmr: "indicator",
            pmp: "indicator",
            cicloFinanceiroDasOperacoesPrincipais: "indicator",
            cicloFinanceiroNCG: "indicator",
          });

          setValueMode(false);
          setCapitalDynamicsData(dashboardResponse?.capitalDynamics?.months);
          break;

        case 3:
          response = await getGrossCashFlowVariation(accountPlanId, year);
          dashboardResponse = await getGrossCashFlow(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          metrics = [
            "ebitida",
            "margemEBITIDA",
            "variacaoNCG",
            "fluxoCaixaOperacional",
            "geracaoCaixa",
          ];
          labels = {
            ebitida: "EBITDA",
            margemEBITIDA: "Margem EBITDA (%)",
            variacaoNCG: "Variação da NCG",
            fluxoCaixaOperacional: "Fluxo de Caixa Operacional",
            geracaoCaixa: "Geração de Caixa (%)",
          };
          setMetricTypes({
            ebitida: "number",
            margemEBITIDA: "percent",
            variacaoNCG: "number",
            fluxoCaixaOperacional: "number",
            geracaoCaixa: "percent",
          });
          setValueMode(true);
          setGrossCashFlowDashData(
            (dashboardResponse?.grossCashFlows?.months ?? []).map(
              (month: any) => ({
                name: month.name,
                ebitida: month.ebitida,
                margemEBITIDA: month.margemEBITIDA,
                fluxoCaixaOperacional: month.fluxoCaixaOperacional,
              })
            )
          );
          break;

        case 4:
          response = await getTurnoverVariation(accountPlanId, year);
          dashboardResponse = await getTurnover(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          setTurnoverData(dashboardResponse?.turnovers?.months);
          metrics = ["giroPME", "giroPMR", "giroPMP", "giroCaixa"];
          labels = {
            giroPME: "Giro PME",
            giroPMR: "Giro PMR",
            giroPMP: "Giro PMP",
            giroCaixa: "Giro Caixa",
          };
          setMetricTypes({
            giroPME: "indicator",
            giroPMR: "indicator",
            giroPMP: "indicator",
            giroCaixa: "indicator",
          });
          setValueMode(false);
          break;

        case 5:
          response = await getLiquidityVariation(accountPlanId, year);
          dashboardResponse = await getLiquidity(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          setLiquidez(dashboardResponse?.liquiditys?.months);
          metrics = ["liquidezCorrente", "liquidezSeca", "liquidezImediata"];
          labels = {
            liquidezCorrente: "Liquidez Corrente",
            liquidezSeca: "Liquidez Seca",
            liquidezImediata: "Liquidez Imediata",
          };
          setMetricTypes({
            liquidezCorrente: "indicator",
            liquidezSeca: "indicator",
            liquidezImediata: "indicator",
          });
          setValueMode(false);
          break;

        case 6:
          response = await getCapitalStructureVariation(accountPlanId, year);
          dashboardResponse = await getCapitalStructure(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          metrics = [
            "terceirosCurtoPrazo",
            "terceirosLongoPrazo",
            "participacaoCapitalTerceiros",
            "participacaoCapitalProprio",
          ];
          labels = {
            terceirosCurtoPrazo: "Endividamento de Terceiros de Curto Prazo",
            terceirosLongoPrazo: "Endividamento de Terceiros de Longo Prazo",
            participacaoCapitalTerceiros:
              "Participação de Capital de Terceiros",
            participacaoCapitalProprio: "Participação de Capital Próprio",
          };

          setValueMode(false);
          setMetricTypes({
            terceirosCurtoPrazo: "percent",
            terceirosLongoPrazo: "percent",
            participacaoCapitalTerceiros: "percent",
            participacaoCapitalProprio: "percent",
          });
          setCapitalStructuresData(dashboardResponse?.capitalStructures?.months);
          break;
      }

      setMonths(extractedMonths);
      if (tabValue === 1 && extractedMonthsFleuriet.length > 0) {
        const lastMonth =
          extractedMonthsFleuriet[extractedMonthsFleuriet.length - 1];
        if (lastMonth.dateMonth) {
          const monthDate = dayjs()
            .year(Number(selectedYear.format("YYYY")))
            .month(lastMonth.dateMonth - 1)
            .startOf("month");

          setSelectedMonth(monthDate);
        }
      }
      setMetricKeys(metrics);
      setMetricLabels(labels);
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeurietData = async () => {
    if (!accountPlanId || !selectedYear || !selectedMonth) return;

    const year = Number(selectedMonth.year());
    const selectedMonthNumber = selectedMonth.month() + 1;

    setLoading(true);
    try {
      const response = await getLiquidityMonth(
        accountPlanId,
        year,
        selectedMonthNumber
      );
      setLiquidityMonth(response);
    } catch (error) {
      console.error("Erro ao buscar dados do Fleuriet:", error);
      toast.error("Erro ao buscar dados do Fleuriet");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData();
    }
  }, [tabValue, selectedYear, accountPlanId]);

  useEffect(() => {
    if (selectedMonth && accountPlanId && selectedYear) {
      fetchFeurietData();
    }
  }, [selectedMonth, accountPlanId, selectedYear]);

  const tabStyle = {
    color: "var(--neutral-700)",
    fontWeight: "bold",
    fontSize: "0.75rem",
    "&.Mui-selected": {
      color: "var(--neutral-700)",
    },
  };

  const allowedMonths = useMemo(() => {
    if (tabValue !== 1 || !months) return [];
    return months.map((m) => m.dateMonth);
  }, [months, tabValue]);

  const renderChartByTab = () => {
    switch (tabValue) {
      case 1:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginLeft: "1rem",
            }}
          >
            <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <MonthNavigator
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  shouldDisableMonth={(date) => {
                    const month = date.month() + 1;
                    return !allowedMonths.includes(month);
                  }}
                />
                <Box sx={{ display: "flex", gap: 9, mt: 2 }}>
                  <Typography>ATIVO</Typography>
                  <Typography>PASSIVO</Typography>
                </Box>
                {selectedMonth && (
                  <FleurietGestaoLiquidezChart
                    propData={liquidityMonth?.liquidityVariables?.months || []}
                  />
                )}
              </Box>
              <LiquidityChart data={liquidityVariables} />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CapitalDynamicsChart data={capitalDynamicsData} />
          </Box>
        );
      case 3:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {grossCashFlowDashData.length > 0 ? (
              <GrossCashFlowChart data={grossCashFlowDashData} />
            ) : (
              <Typography>Nenhum dado disponível.</Typography>
            )}
          </Box>
        );
      case 4:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "auto",
            }}
          >
            {turnoverData.length > 0 ? (
              <TurnoverChart data={turnoverData} />
            ) : (
              <Typography>Nenhum dado disponível.</Typography>
            )}
          </Box>
        );
      case 5:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              height: "auto",
            }}
          >
            {liquidez.length > 0 ? (
              <LiquidityLineChart data={liquidez} />
            ) : (
              <Typography>Nenhum dado disponível.</Typography>
            )}
          </Box>
        );
      case 6:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CapitalStructureStackedBarChart data={capitalStructuresData} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <MainTemplate>
      <MainContainer isOpen={isOpen}>
        <Title>Gestão da Liquidez</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              width: "100%",
              mb: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="Tabs gestão"
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--neutral-700)",
                },
              }}
            >
              <Tab label="Variáveis da Liquidez" value={1} sx={tabStyle} />
              <Tab
                label="Dinâmica do Capital de Giro"
                value={2}
                sx={tabStyle}
              />
              <Tab
                label="Geração de Fluxo de Caixa Bruto"
                value={3}
                sx={tabStyle}
              />
              <Tab label="Rotatividade" value={4} sx={tabStyle} />
              <Tab label="Liquidez" value={5} sx={tabStyle} />
              <Tab label="Estrutura de Capital" value={6} sx={tabStyle} />
            </Tabs>
          </Box>

          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <TableValueVisualization />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  label="Ano"
                  value={selectedYear}
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setSelectedYear(newValue);
                    }
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
            <div>
              <BudgetToggleButton
                showBudgetColumns={showBudgetColumns}
                setShowBudgetColumns={setShowBudgetColumns}
              />
            </div>
          </Box>

          <Box>
            <ResultsTableVariation
              months={months}
              metricKeys={metricKeys}
              metricLabels={metricLabels}
              enableValueMode={valueMode}
              metricTypes={metricTypes}
              showBudgetColumns={showBudgetColumns}
            />
          </Box>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {renderChartByTab()}
          </Box>
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
