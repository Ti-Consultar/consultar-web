import { useEffect, useState } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { BalancoContabilTable } from "./table";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getBalancoContabil } from "../../../services/apis/routes/classification.service";
import { toast } from "react-toastify";
import { ValueDisplayMode } from "../../Classification/Table";

const STORAGE_KEY = "accountPlanTable:valueMode";

export const BalancoContabil = () => {
  const [tabValue, setTabValue] = useState(1); // 1 = Ativo, 2 = Passivo
  const [selectedYear, setSelectedYear] = useState(dayjs().startOf("year"));
  const [accountPlanId, setAccountPlanId] = useState<number>();
  const { setLoading } = useLoading();
  const [data, setData] = useState<any>([]);
  const { groupId, companyid, subCompanyId } = useParams();
  const [valueMode, setValueMode] = useState<ValueDisplayMode>("TOTAL");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "K" || stored === "C" || stored === "TOTAL") {
      setValueMode(stored);
    }
  }, []);

  const formatValue = (value: number) => {
    switch (valueMode) {
      case "K":
        return `${(value / 1000000).toFixed(1)}`;
      case "C":
        return Math.round(value / 1000).toLocaleString("pt-BR");
      default:
        return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    }
  };

  useEffect(() => {
    if (groupId) {
      const getAccountPlanId = async (
        groupId: number,
        companyId?: number,
        subCompanyId?: number
      ): Promise<number | null> => {
        try {
          setLoading(true, "Salvando data...");
          const response = await getAccountPlan(
            groupId,
            companyId,
            subCompanyId
          );

          const data = response.data;

          if (!Array.isArray(data) || data.length === 0) return null;

          const lastItem = data[data.length - 1];

          setAccountPlanId(lastItem.id);
          setLoading(false);

          return null;
        } catch (error) {
          setLoading(false);
          console.error("Failed to fetch AccountPlanId", error);
          throw error;
        }
      };

      getAccountPlanId(
        +groupId,
        companyid ? +companyid : undefined,
        subCompanyId ? +subCompanyId : undefined
      );
    }
  }, [groupId, companyid, subCompanyId]);

  const handleSearch = async (tab?: number) => {
    try {
      setLoading(true, "Buscando Balanço Contábil");
      if (!accountPlanId) return;
      const response = await getBalancoContabil(
        accountPlanId,
        selectedYear.year(),
        tab ?? tabValue // usa o valor recebido, ou o atual do state
      );
      if (response.success === true) {
        setData(response.data?.meses);
      } else {
        toast.warning("Não encontramos um balanço para esta data.");
      }
    } catch (err) {
      toast.error("Ocorreu um erro ao tentar buscar o balanço contábil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
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
                onChange={(newValue) => {
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
              Buscar
            </Button>
          </Box>

          <Container>
            <BalancoContabilTable data={data} format={() => formatValue}/>
          </Container>
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};
