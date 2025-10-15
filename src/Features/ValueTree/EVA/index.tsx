import { Box, Typography } from "@mui/material";
import { MainTemplate } from "../../../components/AppLayout";
import EvaDiagram from "../../../components/EvaDiagram/EvaDiagram";
import { MainContainer } from "./style";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { toast } from "react-toastify";
import { getValueTree } from "../../../services/apis/routes/valueTree";
import { MonthNavigator } from "../../../components/Inputs/MonthNavigator";

export const AgregadoMensal = () => {
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [data, setData] = useState<any>(null);
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);

  useEffect(() => {
    if (!groupId || accountPlanId) return;

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ) => {
      try {
        setLoading(true, "Buscando...");
        const response = await getAccountPlan(groupId, companyId, subCompanyId);
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) return;
        setAccountPlanId(data[data.length - 1].id);
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

      if (!selectedDate && response?.valueTreeYearMonth) {
        const { year: backendYear, month: backendMonth } =
          response.valueTreeYearMonth;
        const initialDate = dayjs().year(backendYear).month(backendMonth - 1);
        setSelectedDate(initialDate);
        setYear(backendYear);
        setMonth(backendMonth + 1);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      fetchData(year, 0);
    }
  }, [accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Typography>Árvore de Valor - EVA</Typography>

          <MonthNavigator
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
          />
        </Box>

        <Box mt={2}>{data && <EvaDiagram data={data} />}</Box>
      </MainContainer>
    </MainTemplate>
  );
};
