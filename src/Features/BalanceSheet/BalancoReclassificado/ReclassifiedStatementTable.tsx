import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type Ref,
  type UIEventHandler,
} from "react";
import { TableEmptyState } from "../../../components/TableControls/MonthTableControls";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import type {
  ReclassifiedBalanceSheetRow,
  ReclassifiedPeriod,
  ReclassifiedScenario,
} from "../../../types/reclassifiedBalanceSheetV2";
import {
  buildReclassifiedDetailRows,
  type ReclassifiedDetailRow,
} from "./reclassifiedDetailsAdapter";
import {
  canExpandReclassifiedRow,
  formatReclassifiedCurrency,
  getScenarioColumns,
  sortByDisplayOrder,
} from "./reclassifiedBalanceSheet.utils";
import {
  FINANCIAL_STICKY_FIRST_CELL_SX,
  FINANCIAL_STICKY_HEAD_FIRST_CELL_SX,
  FINANCIAL_TABLE_HOVER_SX,
  FINANCIAL_TABLE_COLORS,
  getFinancialColumnHoverSx,
  getFinancialMetricHeaderSx,
  getFinancialMonthHeaderSx,
  getFinancialValueCellSx,
  useFinancialTableHover,
} from "../financialTableStyles";

interface ReclassifiedStatementTableProps {
  title: string;
  rows: ReclassifiedBalanceSheetRow[];
  periods: ReclassifiedPeriod[];
  scenarios: ReclassifiedScenario[];
  showBudgetColumns?: boolean;
  hiddenPeriodKeys: string[];
  isExpandedView?: boolean;
  containerRef?: Ref<HTMLDivElement>;
  onHorizontalScroll?: UIEventHandler<HTMLDivElement>;
}

const getRowPresentation = (row: ReclassifiedBalanceSheetRow) => {
  if (row.rowType === "total") {
    return {
      backgroundColor: FINANCIAL_TABLE_COLORS.total,
      fontWeight: 700,
      borderTop: `2px solid ${FINANCIAL_TABLE_COLORS.strongBorder}`,
      marginLeft: (row.level ?? 0) * 1.5,
    } as const;
  }

  return {
    backgroundColor: FINANCIAL_TABLE_COLORS.actual,
    fontWeight: row.rowType === "section" ? 600 : 400,
    borderTop: undefined,
    marginLeft: (row.level ?? 0) * 1.5,
  } as const;
};

const buildVisibleRows = (
  rows: ReclassifiedBalanceSheetRow[],
  expandedRows: Set<string>,
) => {
  const sortedRows = sortByDisplayOrder(rows);
  const rowCodes = new Set(sortedRows.map((row) => row.code));
  const childrenByParent = new Map<string, ReclassifiedBalanceSheetRow[]>();

  sortedRows.forEach((row) => {
    if (!row.parentCode || !rowCodes.has(row.parentCode)) return;
    const children = childrenByParent.get(row.parentCode) ?? [];
    children.push(row);
    childrenByParent.set(row.parentCode, children);
  });

  const visibleRows: ReclassifiedBalanceSheetRow[] = [];
  const appendRow = (row: ReclassifiedBalanceSheetRow) => {
    visibleRows.push(row);
    if (row.expandable && !expandedRows.has(row.code)) return;
    sortByDisplayOrder(childrenByParent.get(row.code) ?? []).forEach(appendRow);
  };

  sortedRows
    .filter((row) => !row.parentCode || !rowCodes.has(row.parentCode))
    .forEach(appendRow);

  return visibleRows;
};

export const ReclassifiedStatementTable = ({
  title,
  rows,
  periods,
  scenarios,
  showBudgetColumns = false,
  hiddenPeriodKeys,
  isExpandedView = false,
  containerRef,
  onHorizontalScroll,
}: ReclassifiedStatementTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();
  const { isColumnHovered, tableHoverProps } = useFinancialTableHover();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedDetailRows, setExpandedDetailRows] = useState<Set<string>>(
    new Set(),
  );
  const sortedPeriods = useMemo(
    () => sortByDisplayOrder(periods),
    [periods],
  );
  const scenarioColumns = useMemo(
    () => getScenarioColumns(scenarios, showBudgetColumns),
    [scenarios, showBudgetColumns],
  );
  const visiblePeriods = useMemo(() => {
    const hidden = new Set(hiddenPeriodKeys);
    return sortedPeriods.filter((period) => !hidden.has(period.key));
  }, [hiddenPeriodKeys, sortedPeriods]);
  const visibleRows = useMemo(
    () => buildVisibleRows(rows, expandedRows),
    [expandedRows, rows],
  );
  const detailsByRow = useMemo(
    () =>
      new Map(
        rows.map(
          (row) =>
            [
              row.code,
              buildReclassifiedDetailRows(row.details?.data),
            ] as const,
        ),
      ),
    [rows],
  );
  const classificationExpansionRowCodes = useMemo(() => {
    const parentCodes = new Set(
      rows.flatMap((row) => (row.parentCode ? [row.parentCode] : [])),
    );

    return rows
      .filter(
        (row) =>
          canExpandReclassifiedRow(row) &&
          (parentCodes.has(row.code) ||
            (detailsByRow.get(row.code) ?? []).some(
              (detail) => detail.kind === "totalizer",
            )),
      )
      .map((row) => row.code);
  }, [detailsByRow, rows]);
  const totalizerExpansionKeys = useMemo(
    () =>
      rows.flatMap((row) =>
        (detailsByRow.get(row.code) ?? [])
          .filter(
            (detail) =>
              detail.kind === "totalizer" &&
              (detail.expandable || detail.children.length > 0),
          )
          .map((detail) => `${row.code}:${detail.key}`),
      ),
    [detailsByRow, rows],
  );
  const hasGlobalExpansionTargets =
    classificationExpansionRowCodes.length > 0 ||
    totalizerExpansionKeys.length > 0;
  const areAllClassificationsExpanded =
    hasGlobalExpansionTargets &&
    classificationExpansionRowCodes.every((code) =>
      expandedRows.has(code),
    ) &&
    totalizerExpansionKeys.every((key) => expandedDetailRows.has(key));

  useEffect(() => {
    setExpandedRows(new Set());
    setExpandedDetailRows(new Set());
  }, [rows]);

  const toggleRow = (row: ReclassifiedBalanceSheetRow) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(row.code)) next.delete(row.code);
      else next.add(row.code);
      return next;
    });
  };

  const toggleDetailRow = (key: string) => {
    setExpandedDetailRows((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAllClassifications = () => {
    if (areAllClassificationsExpanded) {
      setExpandedRows(new Set());
      setExpandedDetailRows(new Set());
      return;
    }

    setExpandedRows(new Set(classificationExpansionRowCodes));
    setExpandedDetailRows(new Set(totalizerExpansionKeys));
  };

  const renderDetailRow = (
    parentCode: string,
    detail: ReclassifiedDetailRow,
    level: number,
  ) => {
    const detailKey = `${parentCode}:${detail.key}`;
    const isExpanded = expandedDetailRows.has(detailKey);
    const isTotalizer = detail.kind === "totalizer";
    const isClassification = detail.kind === "classification";
    const isData = detail.kind === "data";
    const backgroundColor = isTotalizer
      ? FINANCIAL_TABLE_COLORS.subtotal
      : theme.palette.background.paper;
    const detailFontWeight = isTotalizer || isClassification ? 600 : 400;
    return (
      <Fragment key={detailKey}>
        <TableRow
          sx={{
            backgroundColor,
          }}
        >
          <TableCell
            sx={{
              ...FINANCIAL_STICKY_FIRST_CELL_SX,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5} ml={level * 1.5}>
              {detail.expandable ? (
                <IconButton
                  size="small"
                  aria-label={`${isExpanded ? "Recolher" : "Expandir"} itens de ${detail.name}`}
                  onClick={() => toggleDetailRow(detailKey)}
                  sx={{
                    width: 20,
                    height: 20,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    p: 0,
                  }}
                >
                  {isExpanded ? (
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <AddIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
              ) : (
                <Box width={20} flexShrink={0} />
              )}
              <Tooltip title={detail.costCenter ?? detail.name}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontSize: isData ? "0.72rem" : "0.75rem",
                    fontWeight: detailFontWeight,
                    color: isData ? "text.secondary" : "text.primary",
                  }}
                >
                  {detail.name}
                </Typography>
              </Tooltip>
            </Box>
          </TableCell>
          {visiblePeriods.flatMap((period) =>
            scenarioColumns.map((scenario, scenarioIndex) => (
              <TableCell
                data-financial-hover-cell={!isTotalizer}
                data-financial-column={`${period.key}:${scenario.key}`}
                key={`${detailKey}-${period.key}-${scenario.key}`}
                align="right"
                sx={{
                  ...getFinancialValueCellSx(
                    scenario.key,
                    showBudgetColumns &&
                      scenarioIndex === scenarioColumns.length - 1,
                    isTotalizer ? backgroundColor : undefined,
                  ),
                  fontWeight: detailFontWeight,
                  ...getFinancialColumnHoverSx(
                    !isTotalizer &&
                      isColumnHovered(`${period.key}:${scenario.key}`),
                  ),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isData ? "0.72rem" : "0.75rem",
                    fontWeight: detailFontWeight,
                    color: isData ? "text.secondary" : "text.primary",
                  }}
                >
                  {formatReclassifiedCurrency(
                    detail.values[scenario.key]?.[period.key],
                    valueMode,
                  )}
                </Typography>
              </TableCell>
            )),
          )}
        </TableRow>
        {isExpanded &&
          detail.children.map((child) =>
            renderDetailRow(parentCode, child, level + 1),
          )}
      </Fragment>
    );
  };

  const isEmpty = rows.length === 0 || sortedPeriods.length === 0;
  const showEmptyState =
    isEmpty || visiblePeriods.length === 0 || scenarioColumns.length === 0;

  return (
    <Box component="section" width="100%" aria-label={title}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ mb: 0.75, px: 0.25 }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 4,
            height: 18,
            borderRadius: 999,
            backgroundColor: "primary.main",
            flexShrink: 0,
          }}
        />
        <Typography
          component="h3"
          variant="subtitle2"
          fontWeight={800}
          color="text.primary"
          sx={{ letterSpacing: "0.08em", lineHeight: 1.25 }}
        >
          {title}
        </Typography>
        <Box
          aria-hidden="true"
          sx={{ height: "1px", backgroundColor: "divider", flex: 1 }}
        />
      </Box>
      <TableContainer
        ref={containerRef}
        onScroll={onHorizontalScroll}
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxHeight: isExpandedView ? "60vh" : 650,
          position: "relative",
          borderRadius: 3,
          overflow: "auto",
        }}
      >
        {showEmptyState ? (
          <TableEmptyState />
        ) : (
          <Table
            {...tableHoverProps}
            size="small"
            sx={{
              borderCollapse: "collapse",
              minWidth: "max-content",
              ...FINANCIAL_TABLE_HOVER_SX,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...FINANCIAL_STICKY_HEAD_FIRST_CELL_SX,
                    border: `1px solid ${theme.palette.divider}`,
                    height: 40,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                  >
                    <Tooltip
                      title={
                        areAllClassificationsExpanded
                          ? "Recolher todas as classificações"
                          : "Expandir todas as classificações"
                      }
                    >
                      <IconButton
                        size="small"
                        aria-label={
                          areAllClassificationsExpanded
                            ? "Recolher todas as classificações"
                            : "Expandir todas as classificações"
                        }
                        onClick={toggleAllClassifications}
                        sx={{
                          width: 20,
                          height: 20,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          p: 0,
                        }}
                      >
                        {areAllClassificationsExpanded ? (
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <AddIcon sx={{ fontSize: 14 }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <span>Descrição</span>
                  </Box>
                </TableCell>
                {visiblePeriods.map((period) => (
                  <TableCell
                    key={period.key}
                    align="center"
                    colSpan={scenarioColumns.length}
                    sx={{
                      ...getFinancialMonthHeaderSx(showBudgetColumns),
                    }}
                  >
                    <Tooltip
                      title={period.type === "accumulated" ? "Year to Date" : ""}
                    >
                      <span>{period.label}</span>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
              {showBudgetColumns && (
                <TableRow>
                  <TableCell
                    sx={{
                      ...FINANCIAL_STICKY_HEAD_FIRST_CELL_SX,
                      border: `1px solid ${theme.palette.divider}`,
                      top: 40,
                    }}
                  />
                  {visiblePeriods.flatMap((period) =>
                    scenarioColumns.map((scenario, scenarioIndex) => (
                      <TableCell
                        key={`${period.key}-${scenario.key}`}
                        align="right"
                        sx={{
                          ...getFinancialMetricHeaderSx(
                            scenarioIndex === scenarioColumns.length - 1,
                          ),
                        }}
                      >
                        {scenario.label}
                      </TableCell>
                    )),
                  )}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => {
                const presentation = getRowPresentation(row);
                const details = detailsByRow.get(row.code) ?? [];
                const canExpand = canExpandReclassifiedRow(row);
                const isExpanded = expandedRows.has(row.code);

                return (
                  <Fragment key={row.code}>
                    <TableRow
                      sx={{
                        backgroundColor: presentation.backgroundColor,
                        "& > .MuiTableCell-root": {
                          fontWeight: presentation.fontWeight,
                          borderTop: presentation.borderTop,
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          ...FINANCIAL_STICKY_FIRST_CELL_SX,
                          backgroundColor: presentation.backgroundColor,
                          border: `1px solid ${theme.palette.divider}`,
                          borderTop: presentation.borderTop,
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          ml={presentation.marginLeft}
                        >
                          {canExpand ? (
                            <IconButton
                              size="small"
                              aria-label={`${isExpanded ? "Recolher" : "Expandir"} itens de ${row.name}`}
                              onClick={() => toggleRow(row)}
                              sx={{
                                width: 20,
                                height: 20,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                p: 0,
                              }}
                            >
                              {isExpanded ? (
                                <RemoveIcon sx={{ fontSize: 14 }} />
                              ) : (
                                <AddIcon sx={{ fontSize: 14 }} />
                              )}
                            </IconButton>
                          ) : (
                            <Box width={20} flexShrink={0} />
                          )}
                          <Tooltip title={row.name}>
                            <span>{row.name}</span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      {visiblePeriods.flatMap((period) =>
                        scenarioColumns.map((scenario, scenarioIndex) => (
                          <TableCell
                            data-financial-hover-cell={row.rowType !== "total"}
                            data-financial-column={`${period.key}:${scenario.key}`}
                            key={`${row.code}-${period.key}-${scenario.key}`}
                            align="right"
                            sx={{
                              ...getFinancialValueCellSx(
                                scenario.key,
                                showBudgetColumns &&
                                  scenarioIndex === scenarioColumns.length - 1,
                                row.rowType === "total"
                                  ? presentation.backgroundColor
                                  : undefined,
                              ),
                              borderTop: presentation.borderTop,
                              ...getFinancialColumnHoverSx(
                                row.rowType !== "total" &&
                                  isColumnHovered(
                                    `${period.key}:${scenario.key}`,
                                  ),
                              ),
                            }}
                          >
                            {formatReclassifiedCurrency(
                              row.values?.[scenario.key]?.[period.key] ?? null,
                              valueMode,
                            )}
                          </TableCell>
                        )),
                      )}
                    </TableRow>
                    {isExpanded &&
                      details.map((detail) =>
                        renderDetailRow(row.code, detail, (row.level ?? 0) + 1),
                      )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

    </Box>
  );
};
