import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainContainer, Title } from "./styles";
import { useLoading } from "../../contexts/LoadingProvider";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MainTemplate } from "../../components/AppLayout";
import { getCashFlowVariation } from "../../services/apis/routes/cashFlow.service";
import { CashFlowTable } from "./table";
import { TableValueVisualization } from "../../components/Inputs/TableValueVisualization";
import { ExportDialog } from "../../components/ExportModal";
import { useExportUtils } from "../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../utils/formatters/monthTranslator";
import { ExportButton } from "../../components/Button/ExportButton";
import { BudgetToggleButton } from "../../components/Button/TableOptions";
import { getDropdownNavigation } from "../../services/apis/routes/companies.service";
import { CompanyResponse } from "../../types/companyDropdown";
import CompanyNavigationDropdown from "../../components/Inputs/CompanyNavigationDropdown";
import { useAccountPlanId } from "../../utils/hooks/useAccountPlanId";

const CashFlow = () => {
  const [tabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year")
  );
  const [realizado, setRealizado] = useState<any[]>([]);
  const [orcado, setOrcado] = useState<any[]>([]);
  const [variacao, setVariacao] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [exportOpen, setExportMenuOpen] = useState(false);
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });

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

  const fetchData = async () => {
    if (!selectedYear) return;

    setLoading(true, "Buscando fluxo de caixa...");
    const year = Number(selectedYear.format("YYYY"));

    try {
      if (!accountPlanId) return;
      const response = await getCashFlowVariation(accountPlanId, year);

      setRealizado(response.realizado?.cashFlow?.months ?? []);
      setOrcado(response.orcado?.cashFlow?.months ?? []);
      setVariacao(response.variacao?.cashFlow?.months ?? []);
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (!accountPlanId) return;
    fetchDropdown();
  }, [groupId, companyid, subCompanyId]);

  const handleExport = (format: string) => {
    if (!realizado.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } = buildExportData(realizado);

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
    if (accountPlanId) fetchDropdown();
  }, [accountPlanId]);

  useEffect(() => {
    if (accountPlanId) fetchData();
  }, [accountPlanId, selectedYear, tabValue]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Fluxo de Caixa</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              {dropdownData && (
                <Box sx={{ width: "30%" }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={companyid ? Number(companyid) : Number(groupId)}
                    onChange={({ id, type }) => {
                      if (type === "group")
                        return navigate(`/grupos/${id}/fluxo-caixa/`);
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/fluxo-caixa`
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${companyid}/filiais/${id}/fluxo-caixa`
                        );
                    }}
                  />
                </Box>
              )}
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
            realizadoMonths={realizado}
            budgetMonths={orcado}
            variationMonths={variacao}
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

export default CashFlow;
