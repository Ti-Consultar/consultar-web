import { useState, useEffect, useMemo } from "react";
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

import { useNavigate, useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { toast } from "sonner";

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
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { ModernTextField } from "../../../styles/DatePicker";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

/* CACHE  */
const apiCache = new Map();

const GestaoLiquidez = () => {
  const [tabValue, setTabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );

  const [months, setMonths] = useState<any[]>([]);

  const [metricTypes, setMetricTypes] = useState<
    Record<string, "number" | "percent" | "indicator">
  >({});
  const [metricKeys, setMetricKeys] = useState<string[]>([]);
  const [metricLabels, setMetricLabels] = useState<Record<string, string>>({});

  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );

  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null);
  const [liquidityMonth, setLiquidityMonth] = useState<any>();

  /** Dashboard data */
  const [liquidityVariables, setLiquidityVariables] = useState<any[]>([]);
  const [capitalDynamicsData, setCapitalDynamicsData] = useState<any[]>([]);
  const [grossCashFlowDashData, setGrossCashFlowDashData] = useState<any[]>([]);
  const [turnoverData, setTurnoverData] = useState<any[]>([]);
  const [liquidez, setLiquidez] = useState<any[]>([]);
  const [capitalStructuresData, setCapitalStructuresData] = useState<any[]>([]);

  const [showBudgetColumns, setShowBudgetColumns] = useState(false);

  const { setLoading } = useLoading();
  const { isOpen } = useDrawer();
  const navigate = useNavigate();

  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();

  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });

  useEffect(() => {
    const loadSetting = () => {
      const saved = localStorage.getItem("showBudgetColumns");
      setShowBudgetColumns(saved === "true");
    };
    loadSetting();
    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

  useEffect(() => {
    if (tabValue !== 1) return;
    if (!months || months.length === 0) return;

    if (selectedMonth) return;

    const validMonths = [...months]
      .filter((m) => {
        const r = m.realizado;
        if (!r) return false;

        const hasValidData =
          (typeof r.saldoTesouraria === "number" && r.saldoTesouraria !== 0) ||
          (typeof r.ncg === "number" && r.ncg !== 0) ||
          (typeof r.cdg === "number" && r.cdg !== 0) ||
          (typeof r.indiceDeLiquidez === "number" &&
            r.indiceDeLiquidez !== null);

        return hasValidData;
      })
      .sort((a, b) => a.dateMonth - b.dateMonth);

    if (validMonths.length === 0) return;

    const lastValid = validMonths[validMonths.length - 1];

    if (!lastValid?.dateMonth) return;

    const autoMonth = dayjs()
      .year(Number(selectedYear?.format("YYYY")))
      .month(lastValid.dateMonth - 1)
      .startOf("month");

    setSelectedMonth(autoMonth);
  }, [months, tabValue, selectedYear]);

  /**  FetchData (tabelas + gráficos)  */
  const fetchData = async () => {
    if (!selectedYear || !accountPlanId) return;

    const year = Number(selectedYear.format("YYYY"));
    const cacheKey = `tab-${tabValue}-ap-${accountPlanId}-year-${year}`;

    /**  RESTAURAR DO CACHE  */
    if (apiCache.has(cacheKey)) {
      const cached = apiCache.get(cacheKey);

      setMonths(cached.months);
      setMetricKeys(cached.metricKeys);
      setMetricLabels(cached.metricLabels);
      setMetricTypes(cached.metricTypes);

      if (cached.liquidityVariables)
        setLiquidityVariables(cached.liquidityVariables);
      if (cached.capitalDynamicsData)
        setCapitalDynamicsData(cached.capitalDynamicsData);
      if (cached.grossCashFlowDashData)
        setGrossCashFlowDashData(cached.grossCashFlowDashData);
      if (cached.turnoverData) setTurnoverData(cached.turnoverData);
      if (cached.liquidez) setLiquidez(cached.liquidez);
      if (cached.capitalStructuresData)
        setCapitalStructuresData(cached.capitalStructuresData);

      return;
    }

    /**  FETCH REAL  */
    setLoading(true, "Buscando dados...");

    try {
      let metrics: string[] = [];
      let labels: Record<string, string> = {};
      let types: Record<string, "number" | "percent" | "indicator"> = {};
      let extractedMonths: any[] = [];

      let dashboard: any = null;
      let variation: any = null;

      /**  SWITCH TABS  */
      switch (tabValue) {
        case 1: {
          [variation, dashboard] = await Promise.all([
            getLiquidityManagementVariation(accountPlanId, year),
            getLiquidityManagement(accountPlanId, year),
          ]);

          extractedMonths = variation?.months ?? [];

          metrics = ["saldoTesouraria", "ncg", "cdg", "indiceDeLiquidez"];
          labels = {
            saldoTesouraria: "Saldo Tesouraria",
            ncg: "Necessidade de Capital de Giro (NCG)",
            cdg: "Capital de Giro (CDG)",
            indiceDeLiquidez: "Índice de Liquidez (%)",
          };
          types = {
            saldoTesouraria: "number",
            ncg: "number",
            cdg: "number",
            indiceDeLiquidez: "percent",
          };

          const localVars = dashboard?.liquidityVariables?.months ?? [];
          setLiquidityVariables(localVars);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            liquidityVariables: localVars,
          });
          break;
        }

        case 2: {
          [variation, dashboard] = await Promise.all([
            getCapitalDynamicsVariation(accountPlanId, year),
            getCapitalDynamics(accountPlanId, year),
          ]);

          extractedMonths = variation?.months ?? [];

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
          types = {
            pme: "indicator",
            pmr: "indicator",
            pmp: "indicator",
            cicloFinanceiroDasOperacoesPrincipais: "indicator",
            cicloFinanceiroNCG: "indicator",
          };

          const localData = dashboard?.capitalDynamics?.months ?? [];
          setCapitalDynamicsData(localData);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            capitalDynamicsData: localData,
          });
          break;
        }

        case 3: {
          [variation, dashboard] = await Promise.all([
            getGrossCashFlowVariation(accountPlanId, year),
            getGrossCashFlow(accountPlanId, year),
          ]);
          extractedMonths = variation?.months ?? [];

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
          types = {
            ebitida: "number",
            margemEBITIDA: "percent",
            variacaoNCG: "number",
            fluxoCaixaOperacional: "number",
            geracaoCaixa: "percent",
          };

          const localData = (dashboard?.grossCashFlows?.months ?? []).map(
            (m: any) => ({
              name: m.name,
              ebitida: m.ebitida,
              margemEBITIDA: m.margemEBITIDA,
              fluxoCaixaOperacional: m.fluxoCaixaOperacional,
            })
          );

          setGrossCashFlowDashData(localData);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            grossCashFlowDashData: localData,
          });
          break;
        }

        case 4: {
          [variation, dashboard] = await Promise.all([
            getTurnoverVariation(accountPlanId, year),
            getTurnover(accountPlanId, year),
          ]);
          extractedMonths = variation?.months ?? [];

          metrics = ["giroPME", "giroPMR", "giroPMP", "giroCaixa"];
          labels = {
            giroPME: "Giro PME",
            giroPMR: "Giro PMR",
            giroPMP: "Giro PMP",
            giroCaixa: "Giro Caixa",
          };
          types = {
            giroPME: "indicator",
            giroPMR: "indicator",
            giroPMP: "indicator",
            giroCaixa: "indicator",
          };

          const localData = dashboard?.turnovers?.months ?? [];
          setTurnoverData(localData);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            turnoverData: localData,
          });
          break;
        }

        case 5: {
          [variation, dashboard] = await Promise.all([
            getLiquidityVariation(accountPlanId, year),
            getLiquidity(accountPlanId, year),
          ]);
          extractedMonths = variation?.months ?? [];

          metrics = ["liquidezCorrente", "liquidezSeca", "liquidezImediata"];
          labels = {
            liquidezCorrente: "Liquidez Corrente",
            liquidezSeca: "Liquidez Seca",
            liquidezImediata: "Liquidez Imediata",
          };
          types = {
            liquidezCorrente: "indicator",
            liquidezSeca: "indicator",
            liquidezImediata: "indicator",
          };

          const localData = dashboard?.liquiditys?.months ?? [];
          setLiquidez(localData);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            liquidez: localData,
          });
          break;
        }

        case 6: {
          [variation, dashboard] = await Promise.all([
            getCapitalStructureVariation(accountPlanId, year),
            getCapitalStructure(accountPlanId, year),
          ]);
          extractedMonths = variation?.months ?? [];

          metrics = [
            "terceirosCurtoPrazo",
            "terceirosLongoPrazo",
            "participacaoCapitalTerceiros",
            "participacaoCapitalProprio",
          ];
          labels = {
            terceirosCurtoPrazo: "Endividamento de Terceiros de Curto Prazo",
            terceirosLongoPrazo: "Endividamento de Terceiros de Longo Prazo",
            participacaoCapitalTerceiros: "Participação Capital Terceiros",
            participacaoCapitalProprio: "Participação Capital Próprio",
          };
          types = {
            terceirosCurtoPrazo: "percent",
            terceirosLongoPrazo: "percent",
            participacaoCapitalTerceiros: "percent",
            participacaoCapitalProprio: "percent",
          };

          const localData = dashboard?.capitalStructures?.months ?? [];
          setCapitalStructuresData(localData);

          apiCache.set(cacheKey, {
            months: extractedMonths,
            metricKeys: metrics,
            metricLabels: labels,
            metricTypes: types,
            capitalStructuresData: localData,
          });
          break;
        }
      }

      /** Atualiza o restante dos estados */
      setMonths(extractedMonths);
      setMetricKeys(metrics);
      setMetricLabels(labels);
      setMetricTypes(types);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**  Fleuriet  */
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

  useEffect(() => {
    const fetchDropdown = async () => {
      try {
        if (!groupId) return;
        const response = await getDropdownNavigation(Number(groupId));
        setDropdownData(response);
      } catch {
        console.error("Erro ao buscar dropdown");
      }
    };
    fetchDropdown();
  }, [groupId]);

  /**  Effects  */
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

  /**  TABS STYLE  */
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

  /**  RENDER CHARTS  */
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
                  shouldDisableMonth={(date) =>
                    !allowedMonths.includes(date.month() + 1)
                  }
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
    }
  };

  /**  RENDER  */
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
              onChange={(_e, v) => setTabValue(v)}
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
              {dropdownData && (
                <Box sx={{ width: "30%" }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={companyid ? Number(companyid) : Number(groupId)}
                    onChange={({ id, type }) => {
                      if (type === "group")
                        return navigate(
                          `/grupos/${id}/resultados/gestao-liquidez`
                        );
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/resultados/gestao-liquidez`
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${companyid}/filiais/${id}/resultados/gestao-liquidez`
                        );
                    }}
                  />
                </Box>
              )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  label="Ano"
                  value={selectedYear}
                  onChange={(newValue) => newValue && setSelectedYear(newValue)}
                  enableAccessibleFieldDOMStructure={false}
                  slots={{
                    textField: ModernTextField,
                  }}
                  slotProps={{
                    textField: { size: "medium" },
                  }}
                />
              </LocalizationProvider>

              <TableValueVisualization />
            </Box>

            <BudgetToggleButton
              showBudgetColumns={showBudgetColumns}
              setShowBudgetColumns={setShowBudgetColumns}
            />
          </Box>

          <Box>
            <ResultsTableVariation
              months={months}
              metricKeys={metricKeys}
              metricLabels={metricLabels}
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

export default GestaoLiquidez;
