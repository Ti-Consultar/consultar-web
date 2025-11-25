import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { toast } from "sonner";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useNavigate, useParams } from "react-router";
import {
  getEbitidaBudget,
  getNopat,
  getProfitabilityBudget,
  getRentability,
  getReturnExpectation,
} from "../../../services/apis/routes/economicIndices.service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { ExportButton } from "../../../components/Button/ExportButton";
import { ExportDialog } from "../../../components/ExportModal";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { ResultsTableVariation } from "../resultsTableVariation";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { ModernTextField } from "../../../styles/DatePicker";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

export const IndicesEconomicos = () => {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [tabValue, setTabValue] = useState<number>(1);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );
  const [months, setMonths] = useState<any[]>([]);
  const [metricKeys, setMetricKeys] = useState<string[]>([]);
  const [metricLabels, setMetricLabels] = useState<Record<string, string>>({});
  const [metricTypes, setMetricTypes] =
    useState<Record<string, "number" | "percent">>();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [highlightRows, setHighlightRows] = useState<Record<string, boolean>>(
    {}
  );
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });

  useEffect(() => {
    const loadSetting = () => {
      const savedSetting = localStorage.getItem("showBudgetColumns");
      setShowBudgetColumns(savedSetting === "true");
    };

    loadSetting();

    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

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
          response = await getProfitabilityBudget(accountPlanId, year);
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
          extractedMonths = response?.months ?? [];
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
          extractedMonths = response?.months ?? [];
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
          response = await getEbitidaBudget(accountPlanId, year);
          extractedMonths = response?.months ?? [];
          metrics = ["lucroAntesFinanceiro", "depreciacao", "ebitda"];
          labels = {
            lucroAntesFinanceiro:
              "Lucro Operacional Antes do Resultado Financeiro (EBIT)",
            depreciacao: "( + ) Despesas com Depreciação",
            ebitda: "EBITDA",
          };
          break;

        case 5:
          response = await getNopat(accountPlanId, year);
          extractedMonths = response?.months ?? [];
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

  const buildExportData = (
    months: any[],
    metricKeys: string[],
    metricLabels: Record<string, string>,
    metricTypes?: Record<string, "number" | "percent">
  ) => {
    if (!months.length || !metricKeys.length) return { columns: [], rows: [] };

    // Cria colunas
    const columns = [
      { label: "", accessor: (row: any) => row.label },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row[m.name],
      })),
    ];

    // Cria linhas
    const rows = metricKeys.map((key) => {
      const row: Record<string, any> = { label: metricLabels[key] ?? key };

      months.forEach((month) => {
        const value = month[key];

        if (value == null) {
          row[month.name] = "-";
          return;
        }

        if (metricTypes?.[key] === "percent") {
          const normalized = Math.abs(value) <= 1 ? value * 100 : value;
          row[month.name] = `${normalized.toFixed(2).replace(".", ",")}%`;
        } else {
          row[month.name] = value.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        }
      });

      return row;
    });

    return { columns, rows };
  };

  const handleExport = (format: string) => {
    if (!months.length || !metricKeys.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    // Monta os dados tabulares
    const { columns, rows } = buildExportData(
      months,
      metricKeys,
      metricLabels,
      metricTypes
    );

    const fileName = `indices-economicos - ${
      entityName ?? "empresa"
    } ${selectedYear?.year()}`;

    switch (format) {
      case "PDF":
        exportPDF(rows, columns, fileName, "landscape");
        break;
      case "CSV":
        exportCSV(rows, columns, fileName);
        break;
      case "EXCEL":
        exportExcel(rows, columns, fileName);
        break;
      case "PPT":
        exportPPTX(rows, columns, fileName);
        break;
      default:
        toast.error("Formato de exportação inválido");
    }
  };

  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao buscar dropdown");
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData();
      fetchDropdown();
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
                          `/grupos/${id}/resultados/indices-economicos`
                        );
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/resultados/indices-economicos`
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${companyid}/filiais/${id}/resultados/indices-economicos`
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
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                      setSelectedYear(newValue);
                    }
                  }}
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

              <ExportButton onClick={() => setExportMenuOpen(true)} />
            </Box>
            <div>
              <BudgetToggleButton
                showBudgetColumns={showBudgetColumns}
                setShowBudgetColumns={setShowBudgetColumns}
              />
            </div>
          </Box>

          <ResultsTableVariation
            months={months}
            metricKeys={metricKeys}
            metricLabels={metricLabels}
            metricTypes={metricTypes}
            highlightRows={highlightRows}
            showBudgetColumns={showBudgetColumns}
          />
        </Paper>
      </MainContainer>
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportMenuOpen(false)}
        hasChart={false}
        onExport={handleExport}
      />
    </MainTemplate>
  );
};
