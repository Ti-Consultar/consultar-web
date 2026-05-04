import { Box, Typography } from "@mui/material";
import { MainTemplate } from "../../../components/AppLayout";
import EvaDiagram from "../../../components/EvaDiagram/EvaDiagram";
import { MainContainer } from "./style";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useNavigate, useParams } from "react-router";
import { getValueTreeBudget } from "../../../services/apis/routes/valueTree";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { MonthNavigator } from "../../../components/Inputs/MonthNavigator";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { toast } from "sonner";
import { useYear } from "../../../contexts/YearContext";

const AgregadoMensal = () => {
  const { year, setYear } = useYear();
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [showBudgetColumns, setShowBudgetColumns] = useState<boolean>(
    localStorage.getItem("showBudgetColumns") !== "false"
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [data, setData] = useState<any>(null);
  const { setLoading } = useLoading();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  const navigate = useNavigate();
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });

  const fetchData = async (fetchYear?: number, fetchMonth?: number) => {
    setLoading(true, "Buscando dados da Árvore de Valor...");
    try {
      if (!accountPlanId) return;

      const y = fetchYear ?? year;
      const m = fetchMonth ?? month;

      const response = await getValueTreeBudget(accountPlanId, m, y);
      setData(response);

      if (!selectedDate && response?.valueTreeYearMonth) {
        const { year: backendYear, month: backendMonth } =
          response.valueTreeYearMonth;

        const initialDate = dayjs()
          .year(backendYear)
          .month(backendMonth - 1);

        setSelectedDate(initialDate);
        setYear(backendYear);
        setMonth(backendMonth + 1);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da aba:", error);
      toast.error("Erro ao buscar dados da Árvore de Valor.");
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

  useEffect(() => {
    if (accountPlanId) {
      fetchData(year, 1);
      fetchDropdown();
    }
  }, [accountPlanId]);

  return (
    <MainTemplate>
      <MainContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Typography>Árvore de Valor - EVA</Typography>
          {dropdownData && (
            <Box sx={{ width: "18%" }}>
              <CompanyNavigationDropdown
                data={dropdownData.data}
                selectedId={companyid ? Number(companyid) : Number(groupId)}
                onChange={({ id, type }) => {
                  if (type === "group") return navigate(`/grupos/${id}/eva`);
                  if (type === "filial")
                    return navigate(`/grupos/${groupId}/empresas/${id}/eva`);
                  if (type === "sub")
                    return navigate(
                      `/grupos/${groupId}/empresas/${companyid}/filiais/${id}/eva`,
                    );
                }}
              />
            </Box>
          )}

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

          <Box ml="auto">
            <BudgetToggleButton
              showBudgetColumns={showBudgetColumns}
              setShowBudgetColumns={setShowBudgetColumns}
            />
          </Box>
        </Box>

        <Box mt={2}>{data && <EvaDiagram data={data} showBudget={showBudgetColumns} />}</Box>
      </MainContainer>
    </MainTemplate>
  );
};

export default AgregadoMensal;
