import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { ResultsTable } from "../resultsTable";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { toast } from "react-toastify";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useParams } from "react-router";
import {
  getEbitida,
  getNopat,
  getProfitability,
  getRentability,
  getReturnExpectation,
} from "../../../services/apis/routes/economicIndices,service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { MRPIconButton } from "../../../components/Button/IconButton";

export const IndicesEconomicos = () => {
  const [tabValue, setTabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );
  const { setLoading } = useLoading();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [months, setMonths] = useState<any[]>([]);
  const [metricKeys, setMetricKeys] = useState<string[]>([]);
  const [metricLabels, setMetricLabels] = useState<Record<string, string>>({});
  const [metricTypes, setMetricTypes] =
    useState<Record<string, "number" | "percent">>();
  const [highlightRows, setHighlightRows] = useState<Record<string, boolean>>(
    {}
  );
  useState<Record<string, "number" | "percent">>();

  useEffect(() => {
    if (!groupId || accountPlanId) return;

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ): Promise<void> => {
      try {
        setLoading(true, "Buscando...");
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

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    if (!selectedYear) return;

    setLoading(true);
    const year = Number(selectedYear.format("YYYY"));

    try {
      if (!accountPlanId) return;
      let response;
      let metrics: string[] = [];
      let labels: Record<string, string> = {};
      let extractedMonths: any[] = [];

      switch (tabValue) {
        case 1:
          response = await getProfitability(accountPlanId, year);
          extractedMonths = response?.profitability?.months ?? [];
          metrics = [
            "margemBruta",
            "margemEBITDA",
            "margemOperacional",
            "margemNOPAT",
            "margemLiquida",
          ];
          labels = {
            margemBruta: "Margem Bruta",
            margemEBITDA: "Margem EBITDA",
            margemOperacional: "Margem Operacional",
            margemNOPAT: "Margem do NOPAT",
            margemLiquida: "Margem Líquida",
          };
          setMetricTypes({
            margemBruta: "percent",
            margemEBITDA: "percent",
            margemOperacional: "percent",
            margemNOPAT: "percent",
            margemLiquida: "percent",
          });
          break;

        case 2:
          response = await getRentability(accountPlanId, year);
          extractedMonths = response?.rentability?.months ?? [];
          metrics = ["roi", "liquidoMensalROE", "liquidoInicioROE"];
          labels = {
            roi: "Retorno do Investimento (ROI)",
            liquidoMensalROE: "Retorno do Patrimônio Líquido Mensal (ROE)",
            liquidoInicioROE: "Retorno do Patrimônio Líquido do Início (ROE)",
          };
          setMetricTypes({
            roi: "percent",
            liquidoMensalROE: "percent",
            liquidoInicioROE: "percent",
          });
          break;

        case 3:
          response = await getReturnExpectation(accountPlanId, year);
          extractedMonths = response?.returnExpectation?.months ?? [];
          metrics = ["roic", "ke", "criacaoValor"];
          labels = {
            roic: "Retorno Capital Investido (ROIC)",
            ke: "Expectativa de Retorno",
            criacaoValor: "Criação de Valor (EVA)",
          };
          setMetricTypes({
            roic: "percent",
            ke: "percent",
            criacaoValor: "percent",
          });
          break;

        case 4:
          response = await getEbitida(accountPlanId, year);
          extractedMonths = response?.ebitda?.months ?? [];
          metrics = [
            "lucroOperacionalAntesDoResultadoFinanceiro",
            "despesasDepreciacao",
            "ebitda",
          ];
          labels = {
            lucroOperacionalAntesDoResultadoFinanceiro:
              "Lucro Operacional Antes do Resultado Financeiro (EBIT)",
            despesasDepreciacao: "( + ) Despesas com Depreciação",
            ebitda: "EBITDA",
          };
          break;

        case 5:
          response = await getNopat(accountPlanId, year);
          extractedMonths = response?.nopat?.months ?? [];
          metrics = [
            "lucroOperacionalAntes",
            "margemOperacionalDRE",
            "provisaoIRPJCSLL",
            "nopat",
          ];
          labels = {
            lucroOperacionalAntes:
              "Lucro Operacional Antes do Resultado Financeiro (EBIT)",
            margemOperacionalDRE: "Margem Operacional",
            provisaoIRPJCSLL: "Provisão IRPJ/CSLL	",
            nopat: "(=) Resultado Operacional Líquido Após Impostos (NOPAT)",
          };
          setHighlightRows({
            lucroOperacionalAntes: false,
            margemOperacionalDRE: true,
            provisaoIRPJCSLL: false,
            nopat: false,
          });
          setMetricTypes({
            lucroOperacionalAntes: "number",
            margemOperacionalDRE: "percent",
            provisaoIRPJCSLL: "number",
            nopat: "number",
          });
          break;
      }

      setMonths(extractedMonths);
      setMetricKeys(metrics);
      setMetricLabels(labels);
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData();
    }
  }, [tabValue, selectedYear, accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Índices Economicos</Title>
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
              aria-label="Tabs Ativo/Passivo"
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
              <Tab
                label="Lucratividade"
                value={1}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="Rentabilidade"
                value={2}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="Expectativa de Retorno"
                value={3}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="EBITDA"
                value={4}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="NOPAT"
                value={5}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
            </Tabs>
          </Box>

          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TableValueVisualization />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Ano"
                value={selectedYear}
                onChange={(newValue) => {
                  setSelectedYear(newValue);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
            <MRPIconButton
              title="Pesquisar"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            />
          </Box>

          <ResultsTable
            months={months}
            metricKeys={metricKeys}
            metricLabels={metricLabels}
            metricTypes={metricTypes}
            highlightRows={highlightRows}
          />
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
