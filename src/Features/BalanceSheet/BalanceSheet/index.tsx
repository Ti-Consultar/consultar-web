import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { MainTemplate } from "../../../components/AppLayout";
import { ExportButton } from "../../../components/Button/ExportButton";
import { ExportDialog } from "../../../components/ExportModal";
import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { TableValueVisualization } from "../../../components/Inputs/TableValueVisualization";
import YearPicker from "../../../components/Inputs/YearPicker";
import { useDrawer } from "../../../contexts/DrawerContext";
import { useLoading } from "../../../contexts/LoadingProvider";
import { useYear } from "../../../contexts/YearContext";
import { getAccountingBalanceSheetV2 } from "../../../services/apis/routes/accountingBalanceSheetV2.service";
import { getDropdownNavigation } from "../../../services/apis/routes/companies.service";
import type { CompanyResponse } from "../../../types/companyDropdown";
import type {
  ReclassifiedBalanceSheetData,
  ReclassifiedBalanceSheetRow,
} from "../../../types/reclassifiedBalanceSheetV2";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";
import { useExportUtils } from "../../../utils/hooks/useExportUtils";
import { ReclassifiedBalanceSheetTables } from "../BalancoReclassificado/ReclassifiedBalanceSheetTables";
import {
  deriveReclassifiedRows,
  EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
  getScenarioColumns,
  sortByDisplayOrder,
} from "../BalancoReclassificado/reclassifiedBalanceSheet.utils";
import { Container, MainContainer, Title } from "./styles";

interface FinancialExportRow {
  name: string;
  values: Record<string, number | undefined>;
}

const BalancoContabil = () => {
  useBreadcrumb("accounting-balance");

  const navigate = useNavigate();
  const { year, setYear } = useYear();
  const { setLoading } = useLoading();
  const { isOpen } = useDrawer();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { accountPlanId, entityName } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId,
  });
  const [balanceData, setBalanceData] =
    useState<ReclassifiedBalanceSheetData>(
      EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
    );
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );
  const [exportOpen, setExportMenuOpen] = useState(false);
  const { exportPDF, exportCSV, exportExcel, exportPPTX } = useExportUtils();
  const setLoadingRef = useRef(setLoading);

  const periods = useMemo(
    () => sortByDisplayOrder(balanceData.periods),
    [balanceData.periods],
  );
  const scenarios = useMemo(
    () => sortByDisplayOrder(balanceData.scenarios),
    [balanceData.scenarios],
  );
  const { assetRows, liabilityRows, balanceDifferenceRow } = useMemo(
    () => deriveReclassifiedRows(balanceData.rows),
    [balanceData.rows],
  );

  useEffect(() => {
    setLoadingRef.current = setLoading;
  }, [setLoading]);

  useEffect(() => {
    let active = true;

    const fetchBalance = async () => {
      setBalanceData(EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA);
      if (!accountPlanId) return;

      try {
        setLoadingRef.current(true, "Buscando Balanço Contábil");
        const response = await getAccountingBalanceSheetV2({
          accountPlanId,
          year,
        });
        if (!active) return;
        setBalanceData(
          response.data ?? EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA,
        );
      } catch (error) {
        if (!active) return;
        console.error("Erro ao buscar balanço contábil:", error);
        toast.error("Ocorreu um erro ao tentar buscar o balanço contábil");
      } finally {
        if (active) setLoadingRef.current(false);
      }
    };

    void fetchBalance();
    return () => {
      active = false;
      setLoadingRef.current(false);
    };
  }, [accountPlanId, year]);

  useEffect(() => {
    let active = true;

    const fetchDropdown = async () => {
      if (!groupId) return;
      try {
        const response = await getDropdownNavigation(Number(groupId));
        if (active) setDropdownData(response);
      } catch {
        console.error("Erro ao buscar dropdown");
      }
    };

    void fetchDropdown();
    return () => {
      active = false;
    };
  }, [groupId]);

  const buildExportData = () => {
    const exportScenarios = getScenarioColumns(scenarios, false);
    const columns = [
      {
        label: "Conta / Classificação",
        accessor: (row: FinancialExportRow) => row.name,
      },
      ...periods.flatMap((period) =>
        exportScenarios.map((scenario) => ({
          label: period.label,
          accessor: (row: FinancialExportRow) =>
            row.values[`${scenario.key}:${period.key}`] ?? "-",
        })),
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
    if (!balanceData.rows.length) {
      toast.warning("Nenhum dado para exportar");
      return;
    }

    const { columns, rows } = buildExportData();
    const fileName = `balanco-contabil-${entityName}-${year}`;

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
      <MainContainer isOpen={isOpen}>
        <Title>Balanço Contábil</Title>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
              {dropdownData && (
                <Box sx={{ minWidth: 260 }}>
                  <CompanyNavigationDropdown
                    data={dropdownData.data}
                    selectedId={selectedId}
                    onChange={({ id, type, parentId }) => {
                      if (type === "group")
                        return navigate(`/grupos/${id}/contabil`);
                      if (type === "filial")
                        return navigate(
                          `/grupos/${groupId}/empresas/${id}/contabil`,
                        );
                      if (type === "sub")
                        return navigate(
                          `/grupos/${groupId}/empresas/${parentId ?? companyid}/filiais/${id}/contabil`,
                        );
                    }}
                  />
                </Box>
              )}
              <YearPicker year={year} onChange={setYear} />
              <TableValueVisualization />
              <ExportButton onClick={() => setExportMenuOpen(true)} />
            </Box>
          </Box>

          <Container>
            <ReclassifiedBalanceSheetTables
              assetRows={assetRows}
              liabilityRows={liabilityRows}
              balanceDifferenceRow={balanceDifferenceRow}
              periods={periods}
              scenarios={scenarios}
              showBudgetColumns={false}
              hiddenPeriodsStorageKey="balancoContabilV2.hiddenPeriods"
              expandedTitle="Balanço Contábil"
            />
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

export default BalancoContabil;
