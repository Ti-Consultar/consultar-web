import {
  Alert,
  Box,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MainTemplate } from "../../../components/AppLayout";
import { ExportButton } from "../../../components/Button/ExportButton";
import { BudgetToggleButton } from "../../../components/Button/TableOptions";
import { ExportDialog } from "../../../components/ExportModal";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import YearPicker from "../../../components/Inputs/YearPicker";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useYear } from "../../../contexts/YearContext";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import { getDreV2 } from "../../../services/apis/routes/dreV2.service";
import { getReclassifiedBalanceSheetV2 } from "../../../services/apis/routes/reclassifiedBalanceSheetV2.service";
import type { CompanyResponse } from "../../../types/companyDropdown";
import type { DreV2Data } from "../../../types/dreV2";
import type {
  ReclassifiedBalanceSheetData,
  ReclassifiedBalanceSheetRow,
} from "../../../types/reclassifiedBalanceSheetV2";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { DreV2Table } from "../DreV2/table";
import { metricNature } from "./metricNature";
import { ReclassifiedBalanceSheetTables } from "./ReclassifiedBalanceSheetTables";
import {
  EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
  FINANCIAL_STATEMENT_TABS,
  deriveReclassifiedRows,
  getScenarioColumns,
  sortByDisplayOrder,
} from "./reclassifiedBalanceSheet.utils";
import { Container, MainContainer, Title } from "./styles";

const EMPTY_DRE_V2_DATA: DreV2Data = {
  periods: [],
  scenarios: [],
  rows: [],
};

interface FinancialExportRow {
  name: string;
  values: Record<string, number | string | undefined>;
}

const BalancoReclassificado = () => {
  useBreadcrumb("financial-statements");

  const [tabValue, setTabValue] = useState<number>(1);
  const { year, setYear } = useYear();
  const { setLoading } = useLoading();
  const [reclassifiedData, setReclassifiedData] =
    useState<ReclassifiedBalanceSheetData>(
      EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
    );
  const [dreV2Data, setDreV2Data] = useState<DreV2Data>(EMPTY_DRE_V2_DATA);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportOpen, setExportMenuOpen] = useState(false);
  const [showBudgetColumns, setShowBudgetColumns] = useState(false);
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const navigate = useNavigate();
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId,
  });
  const requestSequence = useRef(0);
  const setLoadingRef = useRef(setLoading);

  const periods = useMemo(
    () => sortByDisplayOrder(reclassifiedData.periods ?? []),
    [reclassifiedData.periods],
  );
  const scenarios = useMemo(
    () => sortByDisplayOrder(reclassifiedData.scenarios ?? []),
    [reclassifiedData.scenarios],
  );
  const { assetRows, liabilityRows, balanceDifferenceRow } = useMemo(
    () => deriveReclassifiedRows(reclassifiedData.rows ?? []),
    [reclassifiedData.rows],
  );

  useEffect(() => {
    setLoadingRef.current = setLoading;
  }, [setLoading]);

  useEffect(() => {
    const loadSetting = () => {
      setShowBudgetColumns(
        localStorage.getItem("showBudgetColumns") === "true",
      );
    };
    loadSetting();
    window.addEventListener("storage", loadSetting);
    return () => window.removeEventListener("storage", loadSetting);
  }, []);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    const fetchDropdown = async () => {
      try {
        const response = await getDropdownNavigation(Number(groupId));
        if (!cancelled) setDropdownData(response);
      } catch (error) {
        console.error("Erro ao buscar dropdown:", error);
      }
    };
    void fetchDropdown();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  useEffect(() => {
    if (!accountPlanId) {
      setLoadError(null);
      setReclassifiedData(EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA);
      setDreV2Data(EMPTY_DRE_V2_DATA);
      return;
    }

    const currentRequest = ++requestSequence.current;
    const fetchData = async () => {
      setLoadError(null);
      setLoadingRef.current(
        true,
        tabValue === 3 ? "Buscando DRE" : "Buscando Balanço Contábil",
      );

      if (tabValue === 3) {
        setDreV2Data(EMPTY_DRE_V2_DATA);
      } else {
        setReclassifiedData(EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA);
      }

      try {
        if (tabValue === 3) {
          const response = await getDreV2(accountPlanId, year);
          if (requestSequence.current !== currentRequest) return;
          setDreV2Data(response.data ?? EMPTY_DRE_V2_DATA);
          return;
        }

        const response = await getReclassifiedBalanceSheetV2({
          accountPlanId,
          year,
          groupId: groupId ? Number(groupId) : undefined,
          companyId: companyid ? Number(companyid) : undefined,
          subCompanyId: subCompanyId ? Number(subCompanyId) : undefined,
        });
        if (requestSequence.current !== currentRequest) return;
        setReclassifiedData(
          response.data ?? EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
        );
      } catch (error) {
        if (requestSequence.current !== currentRequest) return;
        console.error("Erro ao buscar demonstrações contábeis:", error);
        setLoadError("Ocorreu um erro ao tentar buscar os dados.");
        toast.error("Ocorreu um erro ao tentar buscar os dados");
      } finally {
        if (requestSequence.current === currentRequest) {
          setLoadingRef.current(false);
        }
      }
    };

    void fetchData();
    return () => {
      if (requestSequence.current === currentRequest) {
        requestSequence.current += 1;
        setLoadingRef.current(false);
      }
    };
  }, [
    accountPlanId,
    companyid,
    groupId,
    subCompanyId,
    tabValue,
    year,
  ]);

  const buildDreV2ExportData = () => {
    const exportPeriods = sortByDisplayOrder(dreV2Data.periods);
    const columns = [
      {
        label: "Conta / Classificação",
        accessor: (row: FinancialExportRow) => row.name,
      },
      ...exportPeriods.map((period) => ({
        label: period.label,
        accessor: (row: FinancialExportRow) =>
          row.values[period.key] ?? "-",
      })),
    ];
    const rows = sortByDisplayOrder(dreV2Data.rows).map((row) => ({
      name: `${"   ".repeat(row.level)}${row.name}`,
      values: row.values.realizado ?? {},
    }));
    return { columns, rows };
  };

  const buildReclassifiedExportData = () => {
    const exportScenarios = getScenarioColumns(scenarios, showBudgetColumns);
    const columns = [
      {
        label: "Conta / Classificação",
        accessor: (row: FinancialExportRow) => row.name,
      },
      ...periods.flatMap((period) =>
        exportScenarios.map((scenario) => {
          const key = `${scenario.key}:${period.key}`;
          return {
            label: showBudgetColumns
              ? `${period.label} - ${scenario.label}`
              : period.label,
            accessor: (row: FinancialExportRow) => row.values[key] ?? "-",
          };
        }),
      ),
    ];

    const statementRows = (
      title: string,
      rows: ReclassifiedBalanceSheetRow[],
    ): FinancialExportRow[] => [
      { name: title, values: {} },
      ...rows.map((row) => ({
        name: `${"   ".repeat(row.level ?? 0)}${row.name}`,
        values: Object.fromEntries(
          periods.flatMap((period) =>
            exportScenarios.map((scenario) => [
              `${scenario.key}:${period.key}`,
              row.values?.[scenario.key]?.[period.key],
            ]),
          ),
        ),
      })),
    ];

    return {
      columns,
      rows: [
        ...statementRows("ATIVO", assetRows),
        ...statementRows("PASSIVO", liabilityRows),
      ],
    };
  };

  const handleExport = (format: string) => {
    const hasData =
      tabValue === 3 ? dreV2Data.rows.length > 0 : reclassifiedData.rows.length > 0;
    if (!hasData) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } =
      tabValue === 3
        ? buildDreV2ExportData()
        : buildReclassifiedExportData();
    const fileName = `demonstracoes-${entityName}-${year}`;
    switch (format) {
      case "PDF":
        exportPDF(rows, columns, fileName, "landscape");
        break;
      case "CSV":
        exportCSV(rows, columns, fileName);
        break;
      case "EXCEL":
        exportExcel(rows, columns, fileName);
        break;
      case "PPT":
        exportPPTX(rows, columns, fileName);
        break;
    }
  };

  const selectedId = subCompanyId
    ? Number(subCompanyId)
    : companyid
      ? Number(companyid)
      : Number(groupId);

  return (
    <MainTemplate>
      <MainContainer>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Title>Demonstrações Contábeis</Title>
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
              onChange={(_event, value: number) => setTabValue(value)}
              aria-label="Abas de demonstrações contábeis"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--neutral-700)",
                },
              }}
            >
              {FINANCIAL_STATEMENT_TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  sx={{
                    color: "var(--neutral-700)",
                    fontWeight: "bold",
                    "&.Mui-selected": { color: "var(--neutral-700)" },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box display="flex" justifyContent="space-between" gap={2}>
            <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
              {dropdownData && (
                <Box sx={{ minWidth: 260 }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={selectedId}
                    onChange={({ id, type, parentId }) => {
                      if (type === "group")
                        return navigate(`/grupos/${id}/demonstracoes-contabeis`);
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/demonstracoes-contabeis`,
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/demonstracoes-contabeis`,
                        );
                    }}
                  />
                </Box>
              )}
              <YearPicker year={year} onChange={setYear} />
              <TableValueVisualization />
              <ExportButton onClick={() => setExportMenuOpen(true)} />
            </Box>
            <BudgetToggleButton
              showBudgetColumns={showBudgetColumns}
              setShowBudgetColumns={setShowBudgetColumns}
            />
          </Box>

          <Container>
            {loadError ? (
              <Alert severity="error" sx={{ width: "100%" }}>
                {loadError}
              </Alert>
            ) : !accountPlanId ? (
              <Alert severity="warning" sx={{ width: "100%" }}>
                Plano de contas não encontrado.
              </Alert>
            ) : tabValue === 3 ? (
              <DreV2Table
                data={dreV2Data}
                showBudgetColumns={showBudgetColumns}
                metricNature={metricNature}
              />
            ) : (
              <ReclassifiedBalanceSheetTables
                assetRows={assetRows}
                liabilityRows={liabilityRows}
                balanceDifferenceRow={balanceDifferenceRow}
                periods={periods}
                scenarios={scenarios}
                showBudgetColumns={showBudgetColumns}
              />
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

export default BalancoReclassificado;
