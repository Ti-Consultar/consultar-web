import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainContainer, Title } from "./styles";
import { useLoading } from "../../contexts/LoadingProvider";
import { useParams } from "react-router";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { toast } from "react-toastify";
import { MainTemplate } from "../../components/AppLayout";
import { getCashFlow } from "../../services/apis/routes/cashFlow.service";
import { CashFlowTable } from "./table";
import { TableValueVisualization } from "../../components/Inputs/TableValueVisualization";
import { MRPIconButton } from "../../components/Button/IconButton";
import { ExportDialog } from "../../components/ExportModal";
import { useExportUtils } from "../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../utils/formatters/monthTranslator";
import { ExportButton } from "../../components/Button/ExportButton";
import { BudgetToggleButton } from "../../components/Button/TableOptions";

export const CashFlow = () => {
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
  const [entityName, setEntityName] = useState<string | null>(null);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);

  const metrics = [
    "lucroOperacionalLiquido",
    "depreciacaoAmortizacao",
    "variacaoNCG",
    "clientes",
    "estoques",
    "outrosAtivosOperacionais",
    "fornecedores",
    "obrigacoesTributariasTrabalhistas",
    "outrosPassivosOperacionais",
    "fluxoDeCaixaOperacional",
    "ativoNaoCirculante",
    "variacaoInvestimento",
    "variacaoImobilizado",
    "variacaoIntangivel",
    "fluxoDeCaixaLivre",
    "captacoesAmortizacoesFinanceira",
    "passivoNaoCirculante",
    "variacaoPatrimonioLiquido",
    "fluxoDeCaixaDaEmpresa",
    "disponibilidadeInicioDoPeriodo",
    "disponibilidadeFinalDoPeriodo",
  ];

  const highlightedMetrics = [
    "variacaoNCG",
    "fluxoDeCaixaOperacional",
    "fluxoDeCaixaLivre",
    "fluxoDeCaixaDaEmpresa",
    "lucroOperacionalLiquido",
  ];

  const metricLabels: Record<string, string> = {
    lucroOperacionalLiquido: "(=) Lucro Operacional Líquido",
    depreciacaoAmortizacao: "(+) Depreciação e Amortização",
    variacaoNCG: "(+/-) Variação da NCG",
    clientes: "Clientes",
    estoques: "Estoques",
    outrosAtivosOperacionais: "Outros Ativos Operacionais",
    fornecedores: "Fornecedores",
    obrigacoesTributariasTrabalhistas: "Obrigações Tributárias e Trabalhistas",
    outrosPassivosOperacionais: "Outros Passivos Operacionais",
    fluxoDeCaixaOperacional: "(=) Fluxo de Caixa Operacional",
    ativoNaoCirculante: "Ativo Não Circulante",
    variacaoInvestimento: "Variação Investimento",
    variacaoImobilizado: "Variação Imobilizado",
    variacaoIntangivel: "Variação Intangível",
    fluxoDeCaixaLivre: "(=) Fluxo de Caixa Livre",
    captacoesAmortizacoesFinanceira: "Captações/Amort. Financeira",
    passivoNaoCirculante: "Passivo Não Circulante",
    variacaoPatrimonioLiquido: "Variação Patrimônio Líquido",
    fluxoDeCaixaDaEmpresa: "(=) Fluxo de Caixa da Empresa",
    disponibilidadeInicioDoPeriodo: "Disponibilidade Início do Período",
    disponibilidadeFinalDoPeriodo: "Disponibilidade Final do Período",
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

      const response = await getCashFlow(accountPlanId, year);
      setData(response.cashFlow?.months);
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

    // Colunas: Conta + meses
    const columns = [
      { label: "Conta", accessor: (row: any) => row.name },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row.values[m.name] ?? "-",
      })),
    ];

    // Linhas: cada chave do objeto vira uma linha
    const rows: any[] = [];

    Object.keys(metricLabels).forEach((field) => {
      const row: any = { name: metricLabels[field], values: {} };
      months.forEach((m) => {
        row.values[m.name] = m[field] ?? "-";
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
        <Title>Fluxo de Caixa</Title>
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

          <CashFlowTable
            metricKeys={metrics}
            metricLabels={metricLabels}
            highlightedMetrics={highlightedMetrics}
            months={data}
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
