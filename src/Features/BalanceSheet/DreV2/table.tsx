import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  MonthTableControls,
  TableEmptyState,
  useMonthVisibility,
} from "../../../components/TableControls/MonthTableControls";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";
import {
  DreV2Data,
  DreV2DetailItem,
  DreV2Period,
  DreV2PeriodColumn,
  DreV2Row,
} from "../../../types/dreV2";
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
import { getDreClassificationExpansionCodes } from "./expansion";

const HIDDEN_PERIODS_STORAGE_KEY = "dreV2Table.hiddenPeriods";

interface DreV2TableProps {
  data: DreV2Data;
  showBudgetColumns?: boolean;
  metricNature?: Record<string, "receita" | "despesa">;
  isExpandedView?: boolean;
}

interface RowPresentation {
  backgroundColor: string;
  fontWeight: 400 | 600 | 700;
  fontStyle: "normal" | "italic";
  marginLeft: number;
}

interface DreV2DetailViewRow {
  key: string;
  name: string;
  costCenter?: string;
  values: Record<string, Record<string, DreV2DetailItem>>;
}

const sortByDisplayOrder = <T extends { displayOrder: number }>(rows: T[]) =>
  [...rows].sort((a, b) => a.displayOrder - b.displayOrder);

const getRowPresentation = (row: DreV2Row): RowPresentation => {
  if (row.rowType === "subtotal") {
    return {
      backgroundColor: FINANCIAL_TABLE_COLORS.subtotal,
      fontWeight: 600,
      fontStyle: "normal",
      marginLeft: row.level * 1.5,
    };
  }

  if (row.rowType === "percentage") {
    return {
      backgroundColor: FINANCIAL_TABLE_COLORS.actual,
      fontWeight: 400,
      fontStyle: "italic",
      marginLeft: Math.max(3, row.level * 1.5),
    };
  }

  if (row.rowType === "classification" || row.rowType === "adjustment") {
    return {
      backgroundColor: FINANCIAL_TABLE_COLORS.actual,
      fontWeight: 400,
      fontStyle: "normal",
      marginLeft: row.level * 1.5,
    };
  }

  return {
    backgroundColor: FINANCIAL_TABLE_COLORS.actual,
    fontWeight: 600,
    fontStyle: "normal",
    marginLeft: row.level * 1.5,
  };
};

const getPeriodColumns = (
  period: DreV2Period,
  showBudgetColumns: boolean,
): DreV2PeriodColumn[] => {
  const columns = sortByDisplayOrder(period.columns ?? []);
  if (showBudgetColumns) return columns;

  const primaryKey = period.type === "rolling" ? "rolling" : "realizado";
  const primaryColumn = columns.find((column) => column.key === primaryKey);
  return primaryColumn ? [primaryColumn] : columns.slice(0, 1);
};

const getDetailKey = (detail: DreV2DetailItem) =>
  `${detail.name}:${detail.costCenter ?? ""}`;

const getDetailRows = (
  row: DreV2Row,
  periods: DreV2Period[],
  showBudgetColumns: boolean,
): DreV2DetailViewRow[] => {
  const detailRows = new Map<string, DreV2DetailViewRow>();

  periods.forEach((period) => {
    getPeriodColumns(period, showBudgetColumns).forEach((column) => {
      const details = row.details.data?.[column.key]?.[period.key] ?? [];
      details.forEach((detail) => {
        const key = getDetailKey(detail);
        const detailRow = detailRows.get(key) ?? {
          key,
          name: detail.name,
          costCenter: detail.costCenter,
          values: {},
        };
        const columnValues = detailRow.values[column.key] ?? {};
        columnValues[period.key] = detail;
        detailRow.values[column.key] = columnValues;
        detailRows.set(key, detailRow);
      });
    });
  });

  return Array.from(detailRows.values());
};

const getVisibleRows = (
  rows: DreV2Row[],
  periodKeys: string[],
  expandedRows: Set<string>,
) => {
  const sortedRows = sortByDisplayOrder(rows);
  const rowCodes = new Set(sortedRows.map((row) => row.code));
  const allChildrenByParent = new Map<string, DreV2Row[]>();

  sortedRows.forEach((row) => {
    if (!row.parentCode || !rowCodes.has(row.parentCode)) return;
    const children = allChildrenByParent.get(row.parentCode) ?? [];
    children.push(row);
    allChildrenByParent.set(row.parentCode, children);
  });

  const rowHasData = (row: DreV2Row) =>
    Object.values(row.values ?? {}).some((scenarioValues) =>
      periodKeys.some((periodKey) => {
        const value = scenarioValues?.[periodKey];
        return typeof value === "number";
      }),
    ) ||
    Object.values(row.details.data ?? {}).some((scenarioDetails) =>
      periodKeys.some((periodKey) =>
        (scenarioDetails?.[periodKey] ?? []).some(
          (detail) => detail.value !== null && detail.value !== undefined,
        ),
      ),
    );
  const rowsWithData = new Set<string>();
  const rowOrDescendantHasData = (row: DreV2Row): boolean => {
    const descendantHasData = (allChildrenByParent.get(row.code) ?? [])
      .map(rowOrDescendantHasData)
      .some(Boolean);
    const hasData = rowHasData(row) || descendantHasData;
    if (hasData) rowsWithData.add(row.code);
    return hasData;
  };

  sortedRows
    .filter((row) => !row.parentCode || !rowCodes.has(row.parentCode))
    .forEach(rowOrDescendantHasData);

  const filteredRows = sortedRows.filter((row) => rowsWithData.has(row.code));
  const filteredRowCodes = new Set(filteredRows.map((row) => row.code));
  const childrenByParent = new Map<string, DreV2Row[]>();
  filteredRows.forEach((row) => {
    if (!row.parentCode || !filteredRowCodes.has(row.parentCode)) return;
    const children = childrenByParent.get(row.parentCode) ?? [];
    children.push(row);
    childrenByParent.set(row.parentCode, children);
  });

  const visibleRows: DreV2Row[] = [];
  const appendRow = (row: DreV2Row) => {
    visibleRows.push(row);
    const children = childrenByParent.get(row.code) ?? [];
    if (!children.length || (row.expandable && !expandedRows.has(row.code))) {
      return;
    }
    sortByDisplayOrder(children).forEach(appendRow);
  };

  filteredRows
    .filter(
      (row) => !row.parentCode || !filteredRowCodes.has(row.parentCode),
    )
    .forEach(appendRow);

  return { visibleRows, childrenByParent };
};

export const DreV2Table = ({
  data,
  showBudgetColumns = false,
  metricNature,
  isExpandedView = false,
}: DreV2TableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();
  const { isColumnHovered, tableHoverProps } = useFinancialTableHover();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [openExpandedModal, setOpenExpandedModal] = useState(false);

  const periods = useMemo(
    () =>
      sortByDisplayOrder(data.periods ?? []).sort(
        (a, b) => Number(a.type === "rolling") - Number(b.type === "rolling"),
      ),
    [data.periods],
  );
  const monthOptions = useMemo(
    () => periods.map((period) => ({ key: period.key, label: period.label })),
    [periods],
  );
  const {
    hiddenMonthKeys,
    showAllMonths,
    hideAllMonths,
    toggleMonthVisibility,
  } = useMonthVisibility(HIDDEN_PERIODS_STORAGE_KEY, monthOptions);
  const visiblePeriods = useMemo(() => {
    const hiddenPeriods = new Set(hiddenMonthKeys);
    return periods.filter(
      (period) =>
        !hiddenPeriods.has(period.key) &&
        getPeriodColumns(period, showBudgetColumns).length > 0,
    );
  }, [hiddenMonthKeys, periods, showBudgetColumns]);
  const dataPeriodKeys = useMemo(() => {
    return periods.map((period) => period.key);
  }, [periods]);
  const { visibleRows, childrenByParent } = useMemo(
    () => getVisibleRows(data.rows ?? [], dataPeriodKeys, expandedRows),
    [data.rows, dataPeriodKeys, expandedRows],
  );
  const classificationExpansionCodes = useMemo(
    () => getDreClassificationExpansionCodes(data.rows ?? []),
    [data.rows],
  );
  const areAllClassificationsExpanded =
    classificationExpansionCodes.length > 0 &&
    classificationExpansionCodes.every((code) => expandedRows.has(code));

  useEffect(() => {
    setExpandedRows(new Set());
  }, [data.rows]);

  const isEmpty = periods.length === 0 || visibleRows.length === 0;
  const showEmptyState =
    isEmpty || visiblePeriods.length === 0;

  const toggleRow = (rowCode: string) => {
    setExpandedRows((current) => {
      const next = new Set(current);
      if (next.has(rowCode)) next.delete(rowCode);
      else next.add(rowCode);
      return next;
    });
  };

  const toggleAllClassifications = () => {
    setExpandedRows(
      areAllClassificationsExpanded
        ? new Set()
        : new Set(classificationExpansionCodes),
    );
  };

  const getValue = (
    row: DreV2Row,
    scenarioKey: string,
    periodKey: string,
  ) => row.values?.[scenarioKey]?.[periodKey] ?? null;

  const formatValue = (value: number | null | undefined, row: DreV2Row) => {
    if (value === undefined || value === null) return "-";
    if (row.valueType === "percentage") {
      return `${value.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}%`;
    }

    let displayValue = Math.abs(value);
    if (valueMode === "MILHAR") displayValue /= 1_000;
    if (valueMode === "MILHARES") displayValue /= 1_000_000;
    const formatted = displayValue.toLocaleString("pt-BR", {
      maximumFractionDigits: 0,
    });
    return value < 0 ? `(${formatted})` : formatted;
  };

  const getVariationVisualForValues = (
    variation: number | null | undefined,
    actual: number | null | undefined,
    budget: number | null | undefined,
    name: string,
  ) => {
    if (
      variation == null ||
      actual == null ||
      budget == null ||
      variation === 0
    ) {
      return { arrow: "", color: "inherit" };
    }

    const isPositive = variation > 0;
    const isExpense = metricNature?.[name] === "despesa";
    const isGood = isExpense ? !isPositive : isPositive;

    return {
      arrow: isPositive ? "▲" : "▼",
      color: isGood ? "#6bc570" : "#df6565",
    };
  };

  const getVariationVisual = (row: DreV2Row, period: DreV2Period) =>
    getVariationVisualForValues(
      getValue(row, "variacao", period.key),
      getValue(
        row,
        period.type === "rolling" ? "rolling" : "realizado",
        period.key,
      ),
      getValue(row, "orcado", period.key),
      row.name,
    );

  return (
    <>
      <MonthTableControls
        monthOptions={monthOptions}
        hiddenMonthKeys={hiddenMonthKeys}
        onShowAllMonths={showAllMonths}
        onHideAllMonths={hideAllMonths}
        onToggleMonth={toggleMonthVisibility}
        onExpand={() => setOpenExpandedModal(true)}
        expandDisabled={isEmpty}
        hideExpand={isExpandedView}
      />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: isExpandedView ? "calc(100vh - 190px)" : 650,
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
                    colSpan={getPeriodColumns(period, showBudgetColumns).length}
                    sx={{
                      ...getFinancialMonthHeaderSx(showBudgetColumns),
                    }}
                  >
                    {period.type === "rolling" && !showBudgetColumns ? (
                      <span>Rolling</span>
                    ) : period.type === "accumulated" ? (
                      <Tooltip title="Year to Date">
                        <span>{period.label}</span>
                      </Tooltip>
                    ) : (
                      <span>{period.label}</span>
                    )}
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
                    getPeriodColumns(period, showBudgetColumns).map(
                      (column, columnIndex, columns) => (
                        <TableCell
                          key={`${period.key}-${column.key}`}
                          align="right"
                          sx={{
                            ...getFinancialMetricHeaderSx(
                              columnIndex === columns.length - 1,
                            ),
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ),
                    ),
                  )}
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {visibleRows.map((row) => {
                const presentation = getRowPresentation(row);
                const hasChildren =
                  (childrenByParent.get(row.code)?.length ?? 0) > 0;
                const detailRows = getDetailRows(
                  row,
                  periods,
                  showBudgetColumns,
                );
                const hasDetails = detailRows.length > 0;
                const canExpand =
                  (row.expandable && hasChildren) || hasDetails;
                const isExpanded = canExpand && expandedRows.has(row.code);

                return (
                  <Fragment key={row.code}>
                    <TableRow
                      sx={{
                        backgroundColor: presentation.backgroundColor,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        "& > .MuiTableCell-root": {
                          fontWeight: presentation.fontWeight,
                          fontStyle: presentation.fontStyle,
                        },
                      }}
                    >
                    <TableCell
                      sx={{
                        ...FINANCIAL_STICKY_FIRST_CELL_SX,
                        backgroundColor: presentation.backgroundColor,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        sx={{ minWidth: 0, ml: presentation.marginLeft }}
                      >
                        {canExpand ? (
                          <IconButton
                            size="small"
                            aria-label={
                              isExpanded
                                ? `Recolher itens de ${row.name}`
                                : `Expandir itens de ${row.name}`
                            }
                            onClick={() => toggleRow(row.code)}
                            sx={{
                              flexShrink: 0,
                              width: 20,
                              height: 20,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: "4px",
                              p: 0,
                              color: theme.palette.text.secondary,
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            {isExpanded ? (
                              <RemoveIcon sx={{ fontSize: 14 }} />
                            ) : (
                              <AddIcon sx={{ fontSize: 14 }} />
                            )}
                          </IconButton>
                        ) : row.rowType === "section" ? (
                          <Box sx={{ width: 20, flexShrink: 0 }} />
                        ) : null}
                        <Tooltip title={row.name}>
                          <span
                            style={{
                              display: "inline-block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.name}
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {visiblePeriods.flatMap((period) =>
                      getPeriodColumns(period, showBudgetColumns).map(
                        (column, columnIndex, columns) => {
                          const value = getValue(row, column.key, period.key);
                          const variationVisual =
                            column.key === "variacao"
                              ? getVariationVisual(row, period)
                              : { arrow: "", color: "inherit" };

                          return (
                            <TableCell
                            data-financial-hover-cell={
                              row.rowType !== "subtotal"
                            }
                            data-financial-column={`${period.key}:${column.key}`}
                            key={`${row.code}-${period.key}-${column.key}`}
                            align="right"
                            sx={{
                              ...getFinancialValueCellSx(
                                column.key,
                                showBudgetColumns &&
                                  columnIndex === columns.length - 1,
                                row.rowType === "subtotal"
                                  ? presentation.backgroundColor
                                  : undefined,
                              ),
                              fontWeight: presentation.fontWeight,
                              ...getFinancialColumnHoverSx(
                                row.rowType !== "subtotal" &&
                                  isColumnHovered(
                                    `${period.key}:${column.key}`,
                                  ),
                              ),
                            }}
                          >
                            <span
                              style={{
                                color: variationVisual.color,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 4,
                              }}
                            >
                              {formatValue(value, row)}
                              {variationVisual.arrow}
                            </span>
                            </TableCell>
                          );
                        },
                      ),
                    )}
                    </TableRow>

                    {isExpanded &&
                      hasDetails &&
                      detailRows.map((detail) => (
                        <TableRow
                          key={`${row.code}-${detail.key}`}
                          sx={{
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              ...FINANCIAL_STICKY_FIRST_CELL_SX,
                              backgroundColor: "#FFFFFF",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 220,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Tooltip
                              title={detail.costCenter ? detail.name : ""}
                              arrow
                              placement="top-start"
                            >
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.75rem",
                                  ml: (row.level + 1) * 1.5,
                                }}
                              >
                                {detail.name}
                              </Typography>
                            </Tooltip>
                          </TableCell>

                          {visiblePeriods.flatMap((period) =>
                            getPeriodColumns(period, showBudgetColumns).map(
                              (column, columnIndex, columns) => {
                                const value =
                                  detail.values[column.key]?.[period.key]
                                    ?.value;
                                const variationVisual =
                                  column.key === "variacao"
                                    ? getVariationVisualForValues(
                                      detail.values.variacao?.[period.key]
                                        ?.value,
                                      detail.values[
                                        period.type === "rolling"
                                          ? "rolling"
                                          : "realizado"
                                      ]?.[period.key]?.value,
                                      detail.values.orcado?.[period.key]?.value,
                                      detail.name,
                                      )
                                    : { arrow: "", color: "inherit" };

                                return (
                                  <TableCell
                                  data-financial-hover-cell="true"
                                  data-financial-column={`${period.key}:${column.key}`}
                                  key={`${row.code}-${detail.key}-${period.key}-${column.key}`}
                                  align="right"
                                  sx={{
                                    ...getFinancialValueCellSx(
                                      column.key,
                                      showBudgetColumns &&
                                        columnIndex === columns.length - 1,
                                    ),
                                    ...getFinancialColumnHoverSx(
                                      isColumnHovered(
                                        `${period.key}:${column.key}`,
                                      ),
                                    ),
                                  }}
                                >
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                      color:
                                        column.key === "variacao"
                                          ? variationVisual.color
                                          : theme.palette.text.secondary,
                                      fontSize: "0.75rem",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 0.5,
                                    }}
                                  >
                                    {formatValue(value, row)}
                                    {variationVisual.arrow}
                                  </Typography>
                                  </TableCell>
                                );
                              },
                            ),
                          )}
                        </TableRow>
                      ))}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!isExpandedView && (
        <Dialog
          open={openExpandedModal}
          onClose={() => setOpenExpandedModal(false)}
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
              fontSize: "1.1rem",
              fontWeight: 700,
              pb: 1,
            }}
          >
            DRE
            <IconButton
              aria-label="Fechar tabela expandida"
              onClick={() => setOpenExpandedModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2.5, pt: 1 }}>
            <DreV2Table
              data={data}
              showBudgetColumns={showBudgetColumns}
              metricNature={metricNature}
              isExpandedView
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
