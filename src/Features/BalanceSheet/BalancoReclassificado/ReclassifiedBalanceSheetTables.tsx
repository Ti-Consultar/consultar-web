import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {
  useMemo,
  useRef,
  useState,
  type RefObject,
  type UIEventHandler,
} from "react";
import {
  MonthTableControls,
  useMonthVisibility,
} from "../../../components/TableControls/MonthTableControls";
import type {
  ReclassifiedBalanceSheetRow,
  ReclassifiedPeriod,
  ReclassifiedScenario,
} from "../../../types/reclassifiedBalanceSheetV2";
import { BalanceCheckSection } from "./BalanceCheckSection";
import { ReclassifiedStatementTable } from "./ReclassifiedStatementTable";
import { sortByDisplayOrder } from "./reclassifiedBalanceSheet.utils";

const HIDDEN_PERIODS_STORAGE_KEY =
  "reclassifiedBalanceSheetV2.hiddenPeriods";

interface ReclassifiedBalanceSheetTablesProps {
  assetRows: ReclassifiedBalanceSheetRow[];
  liabilityRows: ReclassifiedBalanceSheetRow[];
  balanceDifferenceRow?: ReclassifiedBalanceSheetRow;
  periods: ReclassifiedPeriod[];
  scenarios: ReclassifiedScenario[];
  showBudgetColumns?: boolean;
  hiddenPeriodsStorageKey?: string;
  expandedTitle?: string;
}

const SynchronizedStatementTables = ({
  assetRows,
  liabilityRows,
  balanceDifferenceRow,
  periods,
  scenarios,
  showBudgetColumns,
  hiddenPeriodKeys,
  isExpandedView,
}: ReclassifiedBalanceSheetTablesProps & {
  hiddenPeriodKeys: string[];
  isExpandedView: boolean;
}) => {
  const assetContainerRef = useRef<HTMLDivElement>(null);
  const liabilityContainerRef = useRef<HTMLDivElement>(null);

  const synchronizeScroll = (
    targetRef: RefObject<HTMLDivElement | null>,
  ): UIEventHandler<HTMLDivElement> =>
    (event) => {
      const target = targetRef.current;
      if (target && target.scrollLeft !== event.currentTarget.scrollLeft) {
        target.scrollLeft = event.currentTarget.scrollLeft;
      }
    };

  return (
    <Box display="flex" flexDirection="column" width="100%" gap={2.5}>
      <ReclassifiedStatementTable
        title="ATIVO"
        rows={assetRows}
        periods={periods}
        scenarios={scenarios}
        showBudgetColumns={showBudgetColumns}
        hiddenPeriodKeys={hiddenPeriodKeys}
        isExpandedView={isExpandedView}
        containerRef={assetContainerRef}
        onHorizontalScroll={synchronizeScroll(liabilityContainerRef)}
      />
      <ReclassifiedStatementTable
        title="PASSIVO"
        rows={liabilityRows}
        periods={periods}
        scenarios={scenarios}
        showBudgetColumns={showBudgetColumns}
        hiddenPeriodKeys={hiddenPeriodKeys}
        isExpandedView={isExpandedView}
        containerRef={liabilityContainerRef}
        onHorizontalScroll={synchronizeScroll(assetContainerRef)}
      />
      <BalanceCheckSection
        row={balanceDifferenceRow}
        periods={periods}
        scenarios={scenarios}
        showBudgetColumns={showBudgetColumns}
        hiddenPeriodKeys={hiddenPeriodKeys}
      />
    </Box>
  );
};

export const ReclassifiedBalanceSheetTables = ({
  assetRows,
  liabilityRows,
  balanceDifferenceRow,
  periods,
  scenarios,
  showBudgetColumns = false,
  hiddenPeriodsStorageKey = HIDDEN_PERIODS_STORAGE_KEY,
  expandedTitle = "BP Reclassificado",
}: ReclassifiedBalanceSheetTablesProps) => {
  const [isExpandedViewOpen, setIsExpandedViewOpen] = useState(false);
  const sortedPeriods = useMemo(
    () => sortByDisplayOrder(periods),
    [periods],
  );
  const monthOptions = useMemo(
    () =>
      sortedPeriods.map((period) => ({
        key: period.key,
        label: period.label,
      })),
    [sortedPeriods],
  );
  const {
    hiddenMonthKeys,
    showAllMonths,
    hideAllMonths,
    toggleMonthVisibility,
  } = useMonthVisibility(hiddenPeriodsStorageKey, monthOptions);

  const isEmpty =
    periods.length === 0 ||
    (assetRows.length === 0 && liabilityRows.length === 0);

  const controls = (hideExpand = false) => (
    <MonthTableControls
      monthOptions={monthOptions}
      hiddenMonthKeys={hiddenMonthKeys}
      onShowAllMonths={showAllMonths}
      onHideAllMonths={hideAllMonths}
      onToggleMonth={toggleMonthVisibility}
      onExpand={() => setIsExpandedViewOpen(true)}
      expandDisabled={isEmpty}
      hideExpand={hideExpand}
    />
  );

  const tables = (isExpandedView = false) => (
    <SynchronizedStatementTables
      assetRows={assetRows}
      liabilityRows={liabilityRows}
      balanceDifferenceRow={balanceDifferenceRow}
      periods={sortedPeriods}
      scenarios={scenarios}
      showBudgetColumns={showBudgetColumns}
      hiddenPeriodKeys={hiddenMonthKeys}
      isExpandedView={isExpandedView}
    />
  );

  return (
    <Box width="100%">
      {controls()}
      {tables()}

      <Dialog
        open={isExpandedViewOpen}
        onClose={() => setIsExpandedViewOpen(false)}
        fullWidth
        maxWidth="xl"
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "calc(100vw - 48px)",
            height: "calc(100vh - 48px)",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          {expandedTitle}
          <IconButton
            aria-label={`Fechar ${expandedTitle} expandido`}
            onClick={() => setIsExpandedViewOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5, pt: 1 }}>
          {controls(true)}
          {tables(true)}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
