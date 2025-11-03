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
import {
  getCILeECWithBudget,
} from "../../../services/apis/routes/CILeEC.service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { MRPIconButton } from "../../../components/Button/IconButton";
import { ExportButton } from "../../../components/Button/ExportButton";
import { ExportDialog } from "../../../components/ExportModal";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { ResultsTableVariation } from "../resultsTableVariation";
import { normalizeCILECMonths } from "../../../utils/normalizeCILEECMonths";

export const CILeEC = () => {
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
    obrigacoesTributariasTrabalhistas:
      "despesa",
    outrosPassivosOperacionais: "despesa",
    ncg: "receita",
    realizavelLongoPrazo: "receita",
    exigivelALongoPrazoOperacional: "despesa",
    ativosFixos:
      "receita",
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
      const response = await getCILeECWithBudget(accountPlanId, year);
      setData(normalizeCILECMonths(response?.months));
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
      (k) => k !== "name"
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
          `cil-pfl - ${entityName} ${selectedYear.year()}`,
          "landscape"
        );
        break;
      case "CSV":
        exportCSV(
          rows,
          columns,
          `cil-pfl - ${entityName} ${selectedYear.year()}`
        );
        break;
      case "EXCEL":
        exportExcel(
          rows,
          columns,
          `cil-pfl - ${entityName} ${selectedYear.year()}`
        );
        break;
      case "PPT":
        exportPPTX(
          rows,
          columns,
          `cil-pfl - ${entityName} ${selectedYear.year()}`
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
        <Title>CIL E PFL</Title>
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
