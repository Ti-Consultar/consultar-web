import { useEffect, useState, useMemo } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { Container, MainContainer, Title } from "./styles";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  getBalancoContabil,
  getBalancoReclassificado,
} from "../../../services/apis/routes/classification.service";
import { toast } from "react-toastify";
import { BalancoResponse, Month } from "../../../types/balanco";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import BalancoReclassificadoTable from "./table";
import BalancoContabilTable from "../BalanceSheet/table";
import { ExportDialog } from "../../../components/ExportModal";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { monthTranslator } from "../../../utils/formatters/monthTranslator";
import { ExportButton } from "../../../components/Button/ExportButton";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";

export const BalancoReclassificado = () => {
  const [tabValue, setTabValue] = useState<number>(1);
  const [selectedYear, setSelectedYear] = useState<Dayjs>(
    dayjs().startOf("year")
  );
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const { setLoading } = useLoading();
  const [balanceteData, setBalanceteData] = useState<Month[]>([]);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const [entityName, setEntityName] = useState<string | null>(null);
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);

  const highlightRows = useMemo(() => {
    const ids: Record<number, boolean> = {};

    const nomesParaDestacar = [
      "Ativo Financeiro",
      "Ativo Operacional",
      "Ativo Não Circulante",
      "Ativo Fixo",
      "Passivo Financeiro",
      "Passivo Operacional",
      "Outros Ativos Operacionais Total",
      "Passivo Não Circulante",
      "Outros Passivos Operacionais Total",
      "Patrimônio Liquido",
    ];

    balanceteData.forEach((month) => {
      month.totalizer.forEach((tot) => {
        if (nomesParaDestacar.includes(tot.name)) {
          ids[tot.id] = true;
        }
      });
    });

    return ids;
  }, [balanceteData]);

  useEffect(() => {
    const loadSetting = () => {
      const savedSetting = localStorage.getItem("showBudgetColumns");
      setShowBudgetColumns(savedSetting === "true");
    };

    loadSetting();

    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

  useEffect(() => {
    if (!groupId || accountPlanId) return;

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ): Promise<void> => {
      try {
        setLoading(true, "Buscando Plano de Contas...");
        const response = await getAccountPlan(groupId, companyId, subCompanyId);
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) return;
        const lastItem = data[data.length - 1];
        setAccountPlanId(lastItem.id);
        setEntityName(lastItem.group?.name);
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

      const currentTab = tab ?? tabValue;

      let response: BalancoResponse;

      if (currentTab === 1 || currentTab === 2) {
        response = await getBalancoReclassificado(
          accountPlanId,
          selectedYear.year(),
          currentTab
        );
      } else {
        response = await getBalancoContabil(
          accountPlanId,
          selectedYear.year(),
          currentTab
        );
      }

      if (response.success && response.data?.months) {
        setBalanceteData(response.data.months);
      } else {
        toast.warning(
          response.message || "Não encontramos um balanço para esta data."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro ao tentar buscar os dados");
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

  const buildExportData = (months: Month[]) => {
    if (!months.length) return { columns: [], rows: [] };

    // Colunas: "Conta / Classificação" + cada mês
    const columns = [
      { label: "Conta / Classificação", accessor: (row: any) => row.name },
      ...months.map((m) => ({
        label: monthTranslator[m.name] ?? m.name,
        accessor: (row: any) => row.values[m.id] ?? "-",
      })),
    ];
    // Linhas
    const rows: any[] = [];

    const addRow = (name: string, values: Record<number, number | string>) => {
      rows.push({ name, values });
    };

    // Itera os meses
    months.forEach((month) => {
      // Totalizadores do mês
      month.totalizer?.forEach((tot) => {
        // Linha do totalizador
        let existing = rows.find((r) => r.name === tot.name);
        if (!existing) {
          addRow(tot.name, {});
          existing = rows.find((r) => r.name === tot.name);
        }
        existing.values[month.id] = tot.totalValue;

        // Classificações
        tot.classifications?.forEach((cls) => {
          let existingCls = rows.find((r) => r.name === `   ${cls.name}`);
          if (!existingCls) {
            addRow(`   ${cls.name}`, {});
            existingCls = rows.find((r) => r.name === `   ${cls.name}`);
          }
          existingCls.values[month.id] = cls.value;
        });
      });

      // Total geral do mês
      if (month.monthPainelContabilTotalizer) {
        let existingTotGeral = rows.find(
          (r) => r.name === month.monthPainelContabilTotalizer.name
        );
        if (!existingTotGeral) {
          addRow(month.monthPainelContabilTotalizer.name, {});
          existingTotGeral = rows.find(
            (r) => r.name === month.monthPainelContabilTotalizer.name
          );
        }
        existingTotGeral.values[month.id] =
          month.monthPainelContabilTotalizer.totalValue;
      }
    });

    return { columns, rows };
  };

  const handleExport = (format: string) => {
    if (!balanceteData.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } = buildExportData(balanceteData);

    switch (format) {
      case "PDF":
        exportPDF(
          rows,
          columns,
          `demonstracoes-${entityName}-${selectedYear.year()}`,
          "landscape"
        );
        break;
      case "CSV":
        exportCSV(
          rows,
          columns,
          `demonstracoes-${entityName}-${selectedYear.year()}`
        );
        break;
      case "EXCEL":
        exportExcel(
          rows,
          columns,
          `demonstracoes-${entityName}-${selectedYear.year()}`
        );
        break;
      case "PPT":
        exportPPTX(
          rows,
          columns,
          `demonstracoes-${entityName}-${selectedYear.year()}`
        );
        break;
    }
  };

  useEffect(() => {
    if (accountPlanId) {
      handleSearch(1);
    }
  }, [accountPlanId]);

  useEffect(() => {
    if (selectedYear && accountPlanId) {
      handleSearch();
    }
  }, [selectedYear]);

  return (
    <MainTemplate>
      <MainContainer>
        <Title>Demonstrações Contábeis</Title>
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
              <Tab
                label="DRE"
                value={3}
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

          <Box display="flex" justifyContent={"space-between"}>
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <TableValueVisualization />
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
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                />
              </LocalizationProvider>
              <ExportButton onClick={() => setExportMenuOpen(true)} />
            </Box>
            <div>
              <BudgetToggleButton
                showBudgetColumns={showBudgetColumns}
                setShowBudgetColumns={setShowBudgetColumns}
              />
            </div>
          </Box>

          <Container>
            {tabValue === 1 || tabValue === 2 ? (
              <BalancoReclassificadoTable
                months={balanceteData}
                highlightRows={highlightRows}
                showBudgetColumns={showBudgetColumns}
              />
            ) : (
              <BalancoContabilTable months={balanceteData} />
            )}
          </Container>
        </Paper>
      </MainContainer>
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportMenuOpen(false)}
        hasChart={false}
        onExport={handleExport}
      />
    </MainTemplate>
  );
};
