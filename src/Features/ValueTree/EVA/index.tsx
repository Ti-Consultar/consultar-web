import { Box, Typography } from "@mui/material";
import { MainTemplate } from "../../../components/AppLayout";
import EvaDiagram from "../../../components/EvaDiagram/EvaDiagram";
import { MainContainer } from "./style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { toast } from "react-toastify";
import { getValueTree } from "../../../services/apis/routes/valueTree";

export const AgregadoMensal = () => {
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [data, setData] = useState<any>({
    economicView: {
      receitaLiquida: 0,
      receitaLiquidaAcumulado: 0,
      custoDespesaVariavel: 0,
      custoDespesaVariavelAcumulado: 0,
      margemContribuicao: 0,
      margemContribuicaoAcumulado: 0,
      despesasOperacionais: 0,
      despesasOperacionaisAcumulado: 0,
      outrosResultadosOperacionais: 0,
      outrosResultadosOperacionaisAcumulado: 0,
      lajir: 0,
      lajirAcumulado: 0,
      impostos: 0,
      impostosAcumulado: 0,
      nopat: 0,
      nopatAcumulado: 0,
    },
    financialView: {
      disponivel: 0,
      disponivelAcumulado: 0,
      clientes: 0,
      clientesAcumulado: 0,
      estoques: 0,
      estoquesAcumulado: 0,
      outrosAtivosOperacionais: 0,
      outrosAtivosOperacionaisAcumulado: 0,
      fornecedores: 0,
      fornecedoresAcumulado: 0,
      outrosPassivosOperacionais: 0,
      outrosPassivosOperacionaisAcumulado: 0,
      realizavelLongoPrazo: 0,
      realizavelLongoPrazoAcumulado: 0,
      exigivelLongoPrazo: 0,
      exigivelLongoPrazoAcumulado: 0,
      ativosFixos: 0,
      ativosFixosAcumulado: 0,
      capitalDeGiro: 0,
      capitalDeGiroAcumulado: 0,
      capitalInvestido: 0,
      capitalInvestidoAcumulado: 0,
    },
    indicators: {
      nopat: 0,
      nopatAcumulado: 0,
      capitalInvestido: 0,
      capitalInvestidoAcumulado: 0,
      roic: 0,
      roicAcumulado: 0,
      wacc: 0,
      waccAcumulado: 0,
      spread: 0,
      spreadAcumulado: 0,
      eva: 0,
      evA_Acumulado: 0,
    },
  });
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs().startOf("month")
  );

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

  const fetchData = async (fetchYear?: number, fetchMonth?: number) => {
    setLoading(true);
    try {
      if (!accountPlanId) return;

      const y = fetchYear ?? year;
      const m = fetchMonth ?? month;

      const response = await getValueTree(accountPlanId, m, y);
      setData(response);
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      setYear(selectedDate.year());
      setMonth(selectedDate.month() + 1);
    }
  }, [selectedDate]);

  return (
    <MainTemplate>
      <MainContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Árvore de Valor - EVA</Typography>
          <Box display="flex" flexDirection="column" gap={1} mb={2}>
            {/* Label separada */}
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="text.primary"
            >
              Selecione a data
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);

                  if (newValue) {
                    const newYear = newValue.year();
                    const newMonth = newValue.month() + 1;
                    setYear(newYear);
                    setMonth(newMonth);
                    fetchData(newYear, newMonth);
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "1px",
                      },
                      width: "160px",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <EvaDiagram data={data} />
        </Box>
      </MainContainer>
    </MainTemplate>
  );
};
