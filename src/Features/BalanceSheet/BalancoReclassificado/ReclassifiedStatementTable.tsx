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
import { Fragment, useEffect, useMemo, useState } from "react";
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
import { StickyCell, StickyHead, StickyHeadFirstCell } from "./styles";

interface ReclassifiedStatementTableProps {
  title: string;
  rows: ReclassifiedBalanceSheetRow[];
  periods: ReclassifiedPeriod[];
  scenarios: ReclassifiedScenario[];
  showBudgetColumns?: boolean;
  hiddenPeriodKeys: string[];
  isExpandedView?: boolean;
}

const getRowPresentation = (row: ReclassifiedBalanceSheetRow) => {
  const isSection = row.rowType === "section";
  return {
    backgroundColor: isSection ? "#FAFCFE" : "#FAFCFE",
    fontWeight: 700,
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
}: ReclassifiedStatementTableProps) => {
  const theme = useTheme();
  const { valueMode } = useValueDisplay();
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
  const expandableRowCodes = useMemo(
    () =>
      rows
        .filter(canExpandReclassifiedRow)
        .map((row) => row.code),
    [rows],
  );
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
    expandableRowCodes.length > 0 || totalizerExpansionKeys.length > 0;
  const areAllClassificationsExpanded =
    hasGlobalExpansionTargets &&
    expandableRowCodes.every((code) => expandedRows.has(code)) &&
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

    setExpandedRows(new Set(expandableRowCodes));
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
    const isData = detail.kind === "data";
    const backgroundColor = isTotalizer
      ? theme.palette.grey[50]
      : theme.palette.background.paper;
    return (
      <Fragment key={detailKey}>
        <TableRow
          sx={{
            backgroundColor,
            "& > .MuiTableCell-root": { backgroundColor },
          }}
        >
          <TableCell
            sx={{
              ...StickyCell,
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
                    fontWeight: isTotalizer ? 700 : isData ? 400 : 500,
                    color: isData ? "text.secondary" : "text.primary",
                  }}
                >
                  {detail.name}
                </Typography>
              </Tooltip>
            </Box>
          </TableCell>
          {visiblePeriods.flatMap((period) =>
            scenarioColumns.map((scenario) => (
              <TableCell
                key={`${detailKey}-${period.key}-${scenario.key}`}
                align="right"
                sx={{ border: `1px solid ${theme.palette.divider}` }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isData ? "0.72rem" : "0.75rem",
                    fontWeight: isTotalizer ? 700 : 400,
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
                    <Tooltip
                      title={period.type === "accumulated" ? "Year to Date" : ""}
                    >
                      <b>{period.label}</b>
                    </Tooltip>
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
                const details = detailsByRow.get(row.code) ?? [];
                const canExpand = canExpandReclassifiedRow(row);
                const isExpanded = expandedRows.has(row.code);

                return (
                  <Fragment key={row.code}>
                    <TableRow
                      sx={{
                        backgroundColor: presentation.backgroundColor,
                        "& > .MuiTableCell-root": {
                          backgroundColor: presentation.backgroundColor,
                          fontWeight: presentation.fontWeight,
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
                        scenarioColumns.map((scenario) => (
                          <TableCell
                            key={`${row.code}-${period.key}-${scenario.key}`}
                            align="right"
                            sx={{ border: `1px solid ${theme.palette.divider}` }}
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
