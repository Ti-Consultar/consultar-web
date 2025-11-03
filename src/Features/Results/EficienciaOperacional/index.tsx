import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getOperationalEfficienyVariation } from "../../../services/apis/routes/operationalEfficiency.service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { MRPIconButton } from "../../../components/Button/IconButton";
import { ExportDialog } from "../../../components/ExportModal";
import { ExportButton } from "../../../components/Button/ExportButton";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { ResultsTableVariation } from "../resultsTableVariation";

// --- Main BalancoContabil Component (replicated structure) ---
export const EficienciaOperacional = () => {
  const [tabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year")
  );
  const [data, setData] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const [entityName, setEntityName] = useState<string | null>(null);
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();

  const [showBudgetColumns, setShowBudgetColumns] = useState(false);

  const metrics = [
    "receitasLiquidas",
    "custosDespesas",
    "ebitda",
    "margemEBITDA",
    "lucroOperacionalAntesJurosImpostos",
    "resultadoFinanceiro",
    "impostos",
    "lucroLiquido",
    "nopat",
    "margemNOPAT",
    "disponivel",
    "clientes",
    "estoques",
    "fornecedores",
    "ncgTotal",
    "ncgcef",
    "investimentosAtivosFixos",
    "capitalInvestidoLiquido",
    "capitalTurnover",
    "roic",
    "wacc",
    "evaspread",
    "eva",
  ];

  const metricLabels: Record<string, string> = {
    receitasLiquidas: "Receitas Líquidas",
    custosDespesas: "Custos e Despesas",
    ebitda: "EBITDA",
    margemEBITDA: "Margem do EBITDA",
    lucroOperacionalAntesJurosImpostos:
      "Lucro Operacional Antes do Juros e Impostos",
    resultadoFinanceiro: "Resultado Financeiro",
    impostos: "Impostos",
    lucroLiquido: "Lucro Líquido ",
    nopat: "NOPAT",
    margemNOPAT: "Margem do NOPAT",
    disponivel: "Caixa e Equivalentes de Caixa",
    clientes: "Clientes",
    estoques: "Estoques",
    fornecedores: "Fornecedores",
    ncgcef: "NCG (Clientes + Estoques - Fornecedores)",
    ncgTotal: "NGC (Total)",
    investimentosAtivosFixos: "Investimentos em Ativos Fixos",
    capitalInvestidoLiquido: "Capital Investido Líquido",
    capitalTurnover: "Capital Turnover",
    roic: "ROIC",
    wacc: "WACC",
    evaspread: "EVA (SPREAD)",
    eva: "EVA",
  };

  const metricTypes: Record<string, "number" | "percent"> = {
    receitasLiquidas: "number",
    custosDespesas: "number",
    ebitda: "number",
    margemEBITDA: "percent",
    lucroOperacionalAntesJurosImpostos: "number",
    resultadoFinanceiro: "number",
    impostos: "number",
    lucroLiquido: "number",
    nopat: "number",
    margemNOPAT: "percent",
    disponivel: "number",
    clientes: "number",
    estoques: "number",
    fornecedores: "number",
    ncgcef: "number",
    ncgTotal: "number",
    investimentosAtivosFixos: "number",
    capitalInvestidoLiquido: "number",
    capitalTurnover: "percent",
    roic: "percent",
    wacc: "percent",
    evaspread: "percent",
    eva: "number",
  };

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
        setLoading(true, "Buscando...");
        const response = await getAccountPlan(groupId, companyId, subCompanyId);

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const lastItem = data[data.length - 1];
        setAccountPlanId(lastItem.id);
        setEntityName(lastItem.group?.name);
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

      const response = await getOperationalEfficienyVariation(accountPlanId, year);
      setData(response?.months);
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  const buildExportData = (months: any[]) => {
    if (!months.length) return { columns: [], rows: [] };

    // Colunas
    const columns = [
      { label: "", accessor: (row: any) => row.name },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row.values[m.name] ?? "-",
      })),
    ];

    // Função utilitária para formatar
    const formatValue = (value: number) => {
      const divided = value / 10000;

      if (divided < 0) {
        return `(${Math.abs(divided).toLocaleString("pt-BR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })})`;
      }

      return divided.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    };

    // Linhas
    const rows: any[] = [];

    Object.keys(metricLabels).forEach((field) => {
      const row: any = { name: metricLabels[field], values: {} };
      months.forEach((m) => {
        const rawValue = m[field];
        row.values[m.name] =
          typeof rawValue === "number" ? formatValue(rawValue) : "-";
      });
      rows.push(row);
    });

    return { columns, rows };
  };

  const handleExport = (format: string) => {
    if (!data.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } = buildExportData(data);

    switch (format) {
      case "PDF":
        exportPDF(
          rows,
          columns,
          `Fluxo de Caixa - ${entityName} ${selectedYear.year()}`,
          "landscape"
        );
        break;
      case "CSV":
        exportCSV(
          rows,
          columns,
          `Fluxo de Caixa - ${entityName} ${selectedYear.year()}`
        );
        break;
      case "EXCEL":
        exportExcel(
          rows,
          columns,
          `Fluxo de Caixa - ${entityName} ${selectedYear.year()}`
        );
        break;
      case "PPT":
        exportPPTX(
          rows,
          columns,
          `Fluxo de Caixa - ${entityName} ${selectedYear.year()}`
        );
        break;
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData();
    }
  }, [tabValue, selectedYear, accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Eficiência Operacional</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
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
              <MRPIconButton
                title="Pesquisar"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              />

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
            metricKeys={metrics}
            metricLabels={metricLabels}
            months={data}
            metricTypes={metricTypes}
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
