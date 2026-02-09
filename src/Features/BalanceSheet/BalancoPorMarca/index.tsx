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
import { exportDreToPdf } from "./exportDreToPdf";

import "dayjs/locale/pt-br";
import { ExportButton } from "../../../components/Button/ExportButton";

dayjs.locale("pt-br");

const BalancoPorMarca = () => {
  const [data, setData] = useState<NormalizedDreTable | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(
    dayjs().startOf("month"),
  );

  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year"),
  );

  const { groupId } = useParams<{ groupId: string }>();
  const { setLoading } = useLoading();

  const filterMonthFromResponse = (response: any[], month: number) =>
    response.map((entity) => {
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

  const fetchConsolidatedDre = async () => {
    try {
      if (!groupId) return;

      setLoading(true, "Buscando DRE por marcas...");

      const response = await getConsolidatedIncomeStatement(
        Number(groupId),
        Number(selectedYear.format("YYYY")),
      );

      const monthNumber = selectedMonth.month() + 1;
      const filtered = filterMonthFromResponse(response, monthNumber);
      const normalized = normalizeDreConsolidatedTable(filtered);

      setData(normalized);
    } catch (error) {
      console.error("Erro ao buscar DRE consolidado", error);
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
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  views={["year"]}
                  label="Ano"
                  value={selectedYear}
                  onChange={(v) => v && setSelectedYear(v)}
                  slots={{ textField: ModernTextField }}
                  enableAccessibleFieldDOMStructure={false}
                />

                <DatePicker
                  views={["month"]}
                  label="Mês"
                  value={selectedMonth}
                  onChange={(v) => v && setSelectedMonth(v)}
                  slots={{ textField: ModernTextField }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </LocalizationProvider>

              <TableValueVisualization />
              <ExportButton
                onClick={() => {
                  if (!data) return;

                  exportDreToPdf({
                    title: "Demonstração do Resultado - Por Loja",
                    year: Number(selectedYear.format("YYYY")),
                    month: selectedMonth.format("MMMM"),
                    columns: data.columns,
                    rows: data.rows,
                  });
                }}
              />
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
