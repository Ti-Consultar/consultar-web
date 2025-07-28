import { useEffect, useState } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getBalancoContabil } from "../../../services/apis/routes/classification.service";
import { toast } from "react-toastify";
import BalancoContabilTable from "./table";
import { BalancoResponse, Month } from "../../../types/balanco";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";

export const BalancoContabil = () => {
  const [tabValue, setTabValue] = useState<number>(1); // 1 = Ativo, 2 = Passivo
  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year")
  );
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const { setLoading } = useLoading();
  const [balanceteData, setBalanceteData] = useState<Month[]>([]);
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();

  useEffect(() => {
    if (!groupId || accountPlanId) return; // <-- impede loop se accountPlanId já está definido

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ): Promise<void> => {
      try {
        setLoading(true, "Salvando data...");
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

  const handleSearch = async (tab?: number): Promise<void> => {
    try {
      setLoading(true, "Buscando Balanço Contábil");
      if (!accountPlanId) {
        toast.warning("Plano de contas não encontrado");
        return;
      }

      const response: BalancoResponse = await getBalancoContabil(
        accountPlanId,
        selectedYear.year(),
        tab ?? tabValue
      );

      if (response.success && response.data?.months) {
        setBalanceteData(response.data.months);
      } else {
        toast.warning(
          response.message || "Não encontramos um balanço para esta data."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar buscar o balanço contábil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (
    _event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setTabValue(newValue);
    handleSearch(newValue);
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Balanço Contábil</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              width: "100%",
              mb: 3,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              aria-label="Tabs Ativo/Passivo"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--neutral-700)",
                },
              }}
            >
              <Tab
                label="Ativo"
                value={1}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
              <Tab
                label="Passivo"
                value={2}
                sx={{
                  color: "var(--neutral-700)",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "var(--neutral-700)",
                  },
                }}
              />
            </Tabs>
          </Box>

          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Ano"
                value={selectedYear}
                onChange={(newValue: Dayjs | null) => {
                  if (newValue) setSelectedYear(newValue);
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
              onClick={() => handleSearch()}
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              }}
            >
              Pesquisar
            </Button>
            <TableValueVisualization />
          </Box>
          <Container>
            <BalancoContabilTable months={balanceteData} />
          </Container>
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
