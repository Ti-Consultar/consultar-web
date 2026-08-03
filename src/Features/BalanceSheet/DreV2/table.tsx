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
  DreV2Row,
  DreV2Scenario,
} from "../../../types/dreV2";
import {
  StickyCell,
  StickyHead,
  StickyHeadFirstCell,
} from "../BalancoReclassificado/styles";
import { getDreClassificationExpansionCodes } from "./expansion";

const HIDDEN_PERIODS_STORAGE_KEY = "dreV2Table.hiddenPeriods";
const SCENARIO_ORDER = ["orcado", "realizado", "variacao"];
const DEFAULT_SCENARIOS: DreV2Scenario[] = [
  { key: "realizado", label: "Realizado", displayOrder: 1 },
  { key: "orcado", label: "Orçado", displayOrder: 2 },
  { key: "variacao", label: "Variação", displayOrder: 3 },
];

interface DreV2TableProps {
  data: DreV2Data;
  showBudgetColumns?: boolean;
  metricNature?: Record<string, "receita" | "despesa">;
  isExpandedView?: boolean;
}

interface RowPresentation {
  backgroundColor: string;
  fontWeight: 400 | 700;
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
      backgroundColor: "#E8F1FF",
      fontWeight: 700,
      fontStyle: "normal",
      marginLeft: row.level * 1.5,
    };
  }

  if (row.rowType === "percentage") {
    return {
      backgroundColor: "#FAFCFE",
      fontWeight: 400,
      fontStyle: "italic",
      marginLeft: Math.max(3, row.level * 1.5),
    };
  }

  if (row.rowType === "classification" || row.rowType === "adjustment") {
    return {
      backgroundColor: "#FAFCFE",
      fontWeight: 400,
      fontStyle: "normal",
      marginLeft: row.level * 1.5,
    };
  }

  return {
    backgroundColor: "#FAFCFE",
    fontWeight: 700,
    fontStyle: "normal",
    marginLeft: row.level * 1.5,
  };
};

const getScenarioColumns = (
  scenarios: DreV2Scenario[],
  showBudgetColumns: boolean,
) => {
  const sortedScenarios = sortByDisplayOrder(scenarios);
  const defaultByKey = new Map(
    DEFAULT_SCENARIOS.map((scenario) => [scenario.key, scenario]),
  );
  const byKey = new Map(
    sortedScenarios.map((scenario) => [scenario.key, scenario]),
  );

  if (!showBudgetColumns) {
    return [byKey.get("realizado") ?? defaultByKey.get("realizado")!];
  }

  const legacyOrder = SCENARIO_ORDER.map(
    (key) => byKey.get(key) ?? defaultByKey.get(key)!,
  );
  const additionalScenarios = sortedScenarios.filter(
    (scenario) => !SCENARIO_ORDER.includes(scenario.key),
  );

  return [...legacyOrder, ...additionalScenarios];
};

const getDetailKey = (detail: DreV2DetailItem) =>
  `${detail.name}:${detail.costCenter ?? ""}`;

const getDetailRows = (
  row: DreV2Row,
  periods: DreV2Period[],
  scenarios: DreV2Scenario[],
): DreV2DetailViewRow[] => {
  const detailRows = new Map<string, DreV2DetailViewRow>();

  scenarios.forEach((scenario) => {
    periods.forEach((period) => {
      const details = row.details.data?.[scenario.key]?.[period.key] ?? [];
      details.forEach((detail) => {
        const key = getDetailKey(detail);
        const detailRow = detailRows.get(key) ?? {
          key,
          name: detail.name,
          costCenter: detail.costCenter,
          values: {},
        };
        const scenarioValues = detailRow.values[scenario.key] ?? {};
        scenarioValues[period.key] = detail;
        detailRow.values[scenario.key] = scenarioValues;
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
        return typeof value === "number" && value !== 0;
      }),
    ) ||
    Object.values(row.details.data ?? {}).some((scenarioDetails) =>
      periodKeys.some((periodKey) =>
        (scenarioDetails?.[periodKey] ?? []).some(
          (detail) => detail.value !== 0,
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [openExpandedModal, setOpenExpandedModal] = useState(false);

  const periods = useMemo(
    () => sortByDisplayOrder(data.periods ?? []),
    [data.periods],
  );
  const scenarioColumns = useMemo(
    () => getScenarioColumns(data.scenarios ?? [], showBudgetColumns),
    [data.scenarios, showBudgetColumns],
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
    return periods.filter((period) => !hiddenPeriods.has(period.key));
  }, [hiddenMonthKeys, periods]);
  const dataPeriodKeys = useMemo(() => {
    const monthlyPeriodKeys = periods
      .filter((period) => period.type === "month")
      .map((period) => period.key);
    return monthlyPeriodKeys.length
      ? monthlyPeriodKeys
      : periods.map((period) => period.key);
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
    isEmpty || visiblePeriods.length === 0 || scenarioColumns.length === 0;

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
  ) => row.values?.[scenarioKey]?.[periodKey];

  const formatValue = (value: number | null | undefined, row: DreV2Row) => {
    if (value === undefined || value === null || value === 0) return "-";
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
    variation: number | undefined,
    actual: number | undefined,
    budget: number | undefined,
    name: string,
  ) => {
    if (
      variation === undefined ||
      actual === undefined ||
      budget === undefined ||
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
      getValue(row, "realizado", period.key),
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
          <Table size="small" sx={{ borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...StickyHeadFirstCell,
                    border: `1px solid ${theme.palette.divider}`,
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
                      ...StickyHead,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {period.type === "accumulated" ? (
                      <Tooltip title="Year to Date">
                        <b>{period.label}</b>
                      </Tooltip>
                    ) : (
                      <b>{period.label}</b>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {showBudgetColumns && (
                <TableRow>
                  <TableCell
                    sx={{
                      ...StickyHeadFirstCell,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  {visiblePeriods.flatMap((period) =>
                    scenarioColumns.map((scenario) => (
                      <TableCell
                        key={`${period.key}-${scenario.key}`}
                        align="right"
                        sx={{
                          ...StickyHead,
                          border: `1px solid ${theme.palette.divider}`,
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
                const hasChildren =
                  (childrenByParent.get(row.code)?.length ?? 0) > 0;
                const detailRows = getDetailRows(
                  row,
                  periods,
                  scenarioColumns,
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
                          backgroundColor: presentation.backgroundColor,
                          fontWeight: presentation.fontWeight,
                          fontStyle: presentation.fontStyle,
                        },
                      }}
                    >
                    <TableCell
                      sx={{
                        ...StickyCell,
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
                      scenarioColumns.map((scenario) => {
                        const value = getValue(row, scenario.key, period.key);
                        const variationVisual =
                          scenario.key === "variacao"
                            ? getVariationVisual(row, period)
                            : { arrow: "", color: "inherit" };

                        return (
                          <TableCell
                            key={`${row.code}-${period.key}-${scenario.key}`}
                            align="right"
                            sx={{ border: `1px solid ${theme.palette.divider}` }}
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
                      }),
                    )}
                    </TableRow>

                    {isExpanded &&
                      hasDetails &&
                      detailRows.map((detail) => (
                        <TableRow
                          key={`${row.code}-${detail.key}`}
                          sx={{
                            backgroundColor: "#FFFFFF",
                            "& > .MuiTableCell-root": {
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              ...StickyCell,
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
                            scenarioColumns.map((scenario) => {
                              const value =
                                detail.values[scenario.key]?.[period.key]
                                  ?.value;
                              const variationVisual =
                                scenario.key === "variacao"
                                  ? getVariationVisualForValues(
                                      detail.values.variacao?.[period.key]
                                        ?.value,
                                      detail.values.realizado?.[period.key]
                                        ?.value,
                                      detail.values.orcado?.[period.key]?.value,
                                      detail.name,
                                    )
                                  : { arrow: "", color: "inherit" };

                              return (
                                <TableCell
                                  key={`${row.code}-${detail.key}-${period.key}-${scenario.key}`}
                                  align="right"
                                  sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                  }}
                                >
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                      color:
                                        scenario.key === "variacao"
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
                            }),
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
