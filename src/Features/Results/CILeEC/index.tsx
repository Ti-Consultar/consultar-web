import { useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { ResultsTable } from "../resultsTable";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getCILeEC } from "../../../services/apis/routes/CILeEC.service";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";

// --- Main BalancoContabil Component (replicated structure) ---
export const CILeEC = () => {
  const [tabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(
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
    patrimonioLiquido: "( - ) Patrimônio Liquido",
    estruturaDeCapital: "Posição Financeira Líquida",
    cil: "Capital Investido Líquido",
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

  const fetchData = async () => {
    if (!selectedYear) return;

    setLoading(true);
    const year = Number(selectedYear.format("YYYY"));

    try {
      if (!accountPlanId) return;
      const response = await getCILeEC(accountPlanId, year);
      setData(response.ciLeEC?.months);
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
        <Title>CIL E PFL</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              }}
            >
              Buscar
            </Button>
          </Box>

          <ResultsTable
            metricKeys={metrics}
            metricLabels={metricLabels}
            months={data}
            nestedMetrics={nestedMetrics}
          />
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
