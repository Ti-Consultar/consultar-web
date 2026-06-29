import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getCILeECWithBudget } from "../../../services/apis/routes/CILeEC.service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { ExportButton } from "../../../components/Button/ExportButton";
import { ExportDialog } from "../../../components/ExportModal";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { ResultsTableVariation } from "../resultsTableVariation";
import { normalizeCILECMonths } from "../../../utils/normalizeCILEECMonths";
import { CompanyResponse } from "../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { useYear } from "../../../contexts/YearContext";
import YearPicker from "../../../components/Inputs/YearPicker";

const CILeEC = () => {
  useBreadcrumb("cil-ec");

  const [tabValue] = useState<number>(1);
  const { year, setYear } = useYear();
  const [data, setData] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [exportOpen, setExportMenuOpen] = useState(false);
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });
  const navigate = useNavigate();

  const metrics = [
    "disponibilidades",
    "clientes",
    "estoques",
    "outrosAtivosOperacionais",
    "fornecedores",
    "obrigacoesTributariasTrabalhistas",
    "outrosPassivosOperacionais",
    "ncg",
    "realizavelLongoPrazo",
    "exigivelALongoPrazoOperacional",
    "ativosFixos",
    "capitalInvestidoLiquido",
    "estruturaDeCapital",
  ];

  const metricLabels: Record<string, string> = {
    disponibilidades: "( + ) Caixa e Equivalentes de Caixa",
    clientes: "( + ) Clientes",
    estoques: "( + ) Estoque",
    outrosAtivosOperacionais: "( + ) Outros Ativos Operacionais",
    fornecedores: "( - ) Fornecedores",
    obrigacoesTributariasTrabalhistas:
      "( - ) Obrigações Tributárias e Trabalhistas",
    outrosPassivosOperacionais: "( - ) Outros Passivos Operacionais",
    ncg: "( = ) NCG Necessidade de Capital de Giro",
    realizavelLongoPrazo: "( + ) Realizável a Longo Prazo",
    exigivelALongoPrazoOperacional: "( - ) Passivo Não Circulante Operacional",
    ativosFixos:
      "( + ) Ativos Fixos (Investimentos, Imobilizados e Intangíveis)",
    capitalInvestidoLiquido: "( = ) Capital Investido Líquido",
    emprestimos: "( - ) Empréstimos",
    posicaoFinanceiraCurtoPrazo: "( = ) Posição Financeira de Curto Prazo",
    exigivelaLongoPrazoFinanceiro: "( - ) Passivo Não Circulante Financeiro",
    posicaoFinanceiraTerceiros: "( = ) Posição Financeira de Terceiros",
    patrimonioLiquido: "( - ) Patrimônio Líquido",
    estruturaDeCapital: "( = ) Posição Financeira Líquida",
    cil: "Capital Investido Líquido",
  };

  const metricNature: Record<string, "receita" | "despesa"> = {
    disponibilidades: "receita",
    clientes: "receita",
    estoques: "receita",
    outrosAtivosOperacionais: "receita",
    fornecedores: "despesa",
    obrigacoesTributariasTrabalhistas: "despesa",
    outrosPassivosOperacionais: "despesa",
    ncg: "receita",
    realizavelLongoPrazo: "receita",
    exigivelALongoPrazoOperacional: "despesa",
    ativosFixos: "receita",
    capitalInvestidoLiquido: "receita",
    emprestimos: "despesa",
    posicaoFinanceiraCurtoPrazo: "receita",
    exigivelaLongoPrazoFinanceiro: "despesa",
    posicaoFinanceiraTerceiros: "receita",
    patrimonioLiquido: "despesa",
    estruturaDeCapital: "receita",
    cil: "receita",
  };

  const nestedMetrics = {
    estruturaDeCapital: [
      "emprestimos",
      "posicaoFinanceiraCurtoPrazo",
      "exigivelaLongoPrazoFinanceiro",
      "posicaoFinanceiraTerceiros",
      "patrimonioLiquido",
      "estruturaDeCapital",
    ],
    cil: [
      "disponibilidades",
      "clientes",
      "estoques",
      "outrosAtivosOperacionais",
      "fornecedores",
      "obrigacoesTributariasTrabalhistas",
      "outrosPassivosOperacionais",
      "ncg",
      "realizavelLongoPrazo",
      "exigivelALongoPrazoOperacional",
      "ativosFixos",
      "capitalInvestidoLiquido",
    ],
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
    if (!year) return;

    setLoading(true, "Buscando dados...");

    try {
      if (!accountPlanId) return;
      const response = await getCILeECWithBudget(accountPlanId, year);
      setData(normalizeCILECMonths(response?.months));
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

    const columns = [
      { label: "", accessor: (row: any) => row.name },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row.values[m.name] ?? "-",
      })),
    ];

    const formatValue = (value: number) => {
      const divided = value / 10000;
      if (divided < 0) {
        return `(${Math.abs(divided).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`;
      }
      return divided.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const rows: any[] = [];

    rows.push({ name: metricLabels["cil"], values: {} });

    const cilFields = Object.keys(months[0].cil).filter((k) => k !== "name");
    cilFields.forEach((field) => {
      const row: any = {
        name: metricLabels[field] ?? field,
        values: {},
      };
      months.forEach((m) => {
        const rawValue = m.cil[field];
        row.values[m.name] =
          typeof rawValue === "number" ? formatValue(rawValue) : "-";
      });
      rows.push(row);
    });

    rows.push({ name: "", values: {} });

    rows.push({ name: metricLabels["estruturaDeCapital"], values: {} });

    const ecFields = Object.keys(months[0].estruturaDeCapital).filter(
      (k) => k !== "name",
    );
    ecFields.forEach((field) => {
      const row: any = {
        name: metricLabels[field] ?? field,
        values: {},
      };
      months.forEach((m) => {
        const rawValue = m.estruturaDeCapital[field];
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
          `cil-pfl - ${entityName} ${year}`,
          "landscape",
        );
        break;
      case "CSV":
        exportCSV(rows, columns, `cil-pfl - ${entityName} ${year}`);
        break;
      case "EXCEL":
        exportExcel(rows, columns, `cil-pfl - ${entityName} ${year}`);
        break;
      case "PPT":
        exportPPTX(rows, columns, `cil-pfl - ${entityName} ${year}`);
        break;
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData();
      fetchDropdown();
    }
  }, [tabValue, year, accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>CIL E PFL</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              {dropdownData && (
                <Box sx={{ width: "30%" }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={subCompanyId ? Number(subCompanyId) : companyid ? Number(companyid) : Number(groupId)}
                    onChange={({ id, type, parentId }) => {
                      if (type === "group")
                        return navigate(`/grupos/${id}/resultados/cil-ec`);
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/resultados/cil-ec`,
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/resultados/cil-ec`,
                        );
                    }}
                  />
                </Box>
              )}

              <YearPicker
                year={year}
                onChange={(newYear) => setYear(newYear)}
              />

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
            metricKeys={metrics}
            metricLabels={metricLabels}
            months={data}
            nestedMetrics={nestedMetrics}
            showBudgetColumns={showBudgetColumns}
            metricNature={metricNature}
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

export default CILeEC;
