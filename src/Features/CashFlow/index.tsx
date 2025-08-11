import { useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";
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

export const CashFlow = () => {
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
    "receitaLiquida",
    "custosOperacionais",
    "despesasVariaveis",
    "despesasOperacionais",
    "outrosResultados",
    "resultadosFinanceiros",
    "provisoes",
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
  ];

  const metricLabels: Record<string, string> = {
    receitaLiquida: "(=) Receita Líquida",
    custosOperacionais: "(+/-) Custos Operacionais",
    despesasVariaveis: "(+/-) Despesas Variáveis",
    despesasOperacionais: "(+/-) Despesas Operacionais",
    outrosResultados: "(+/-) Outros Resultados",
    resultadosFinanceiros: "(+/-) Resultados Financeiros",
    provisoes: "(+/-) Provisões",
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
    ativoNaoCirculante: "(+) Ativo Não Circulante",
    variacaoInvestimento: "Variação Investimento",
    variacaoImobilizado: "Variação Imobilizado",
    fluxoDeCaixaLivre: "(=) Fluxo de Caixa Livre",
    captacoesAmortizacoesFinanceira: "Captações/Amort. Financeira",
    passivoNaoCirculante: "Passivo Não Circulante",
    variacaoPatrimonioLiquido: "Variação Patrimônio Líquido",
    fluxoDeCaixaDaEmpresa: "(=) Fluxo de Caixa da Empresa",
    disponibilidadeInicioDoPeriodo: "Disponibilidade Início do Período",
    disponibilidadeFinalDoPeriodo: "Disponibilidade Final do Período",
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

          <CashFlowTable
            metricKeys={metrics}
            metricLabels={metricLabels}
            highlightedMetrics={highlightedMetrics}
            months={data}
          />
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
