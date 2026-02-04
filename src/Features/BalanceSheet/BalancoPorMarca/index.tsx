import { useEffect, useState } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { Box, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router";
import { useLoading } from "../../../contexts/LoadingProvider";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import { DreConsolidatedTable } from "./table";
import { ModernTextField } from "../../../styles/DatePicker";
import { normalizeDreConsolidatedTable } from "./tableNormalizer";
import { NormalizedDreTable } from "../../../types/balancoPorMarca";
import { getConsolidatedIncomeStatement } from "../../../services/apis/routes/balancete.service";

const BalancoPorMarca = () => {
  const [data, setData] = useState<NormalizedDreTable | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(
    dayjs().startOf("month"),
  );
  const { groupId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year"),
  );
  const { setLoading } = useLoading();

  const filterMonthFromResponse = (response: any[], month: number) => {
    return response.map((entity) => {
      const monthData = entity.painel?.months?.find(
        (m: any) => m.dateMonth === month,
      );

      return {
        ...entity,
        painel: {
          months: monthData ? [monthData] : [],
        },
      };
    });
  };

  const fetchConsolidatedDre = async () => {
    try {
      setLoading(true, "Buscando DRE por marcas...");
      if (!groupId || !selectedYear || !selectedMonth) return;

      const response = await getConsolidatedIncomeStatement(
        Number(groupId),
        Number(selectedYear.format("YYYY")),
      );

      const monthNumber = selectedMonth.month() + 1;

      const filteredByMonth = filterMonthFromResponse(response, monthNumber);

      const normalized = normalizeDreConsolidatedTable(filteredByMonth);
      setData(normalized);
    } catch {
      console.error("Erro ao buscar DRE consolidado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsolidatedDre();
  }, [groupId, selectedYear, selectedMonth]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Demonstrações Financeiras por Marca</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
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
                  enableAccessibleFieldDOMStructure={false}
                  slots={{
                    textField: ModernTextField,
                  }}
                  slotProps={{
                    textField: { size: "medium" },
                  }}
                />

                <DatePicker
                  views={["month"]}
                  label="Mês"
                  value={selectedMonth}
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue) setSelectedMonth(newValue);
                  }}
                  enableAccessibleFieldDOMStructure={false}
                  slots={{ textField: ModernTextField }}
                  slotProps={{ textField: { size: "medium" } }}
                />
              </LocalizationProvider>
              <TableValueVisualization />
            </Box>
          </Box>

          <Container>
            <DreConsolidatedTable data={data} />
          </Container>
        </Paper>
      </MainContainer>
    </MainTemplate>
  );
};

export default BalancoPorMarca;
