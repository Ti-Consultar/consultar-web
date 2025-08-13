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
  const [data, setData] = useState<any>();
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

  useEffect(() => {
    console.log("Ano:", year);
    console.log("Mês:", month);
  }, [year, month]);

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
          <Typography >Árvore de Valor - EVA</Typography>
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
