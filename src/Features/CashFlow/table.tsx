import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useMemo, useState } from "react";
import { useValueDisplay } from "../../contexts/ValueDisplayContext";
import { getAnnualMetricValue } from "./cashFlow.utils";
import {
  MonthTableControls,
  TableEmptyState,
  useMonthVisibility,
} from "../../components/TableControls/MonthTableControls";
import {
  FINANCIAL_STICKY_FIRST_CELL_SX,
  FINANCIAL_STICKY_HEAD_FIRST_CELL_SX,
  FINANCIAL_TABLE_COLORS,
  FINANCIAL_TABLE_HOVER_SX,
  getFinancialColumnHoverSx,
  getFinancialMetricHeaderSx,
  getFinancialMonthHeaderSx,
  getFinancialValueCellSx,
  useFinancialTableHover,
} from "../BalanceSheet/financialTableStyles";

export interface CashFlowMonth {
  name: string;
  dateMonth: number;
  [key: string]: number | string | null;
}

export interface CashFlowAnnualColumn {
  key: string;
  label: string;
  displayOrder: number;
  value: unknown;
}

export interface CashFlowAnnual {
  year: number;
  type: string;
  displayOrder: number;
  columns: CashFlowAnnualColumn[];
}

interface CashFlowTableProps {
  realizadoMonths: CashFlowMonth[];
  budgetMonths: CashFlowMonth[];
  variationMonths: CashFlowMonth[];
  annual?: CashFlowAnnual | null;
  metricKeys: string[];
  metricLabels: Record<string, string>;
  highlightedMetrics?: string[];
  showBudgetColumns?: boolean;
  metricNature?: Record<string, "receita" | "despesa">;
  isExpandedView?: boolean;
}

const monthNameToPTBR: Record<string, string> = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
  ACUMULADO: "Acumulado",
};

export const CashFlowTable = ({
  realizadoMonths,
  budgetMonths,
  variationMonths,
  annual,
  metricKeys,
  metricLabels,
  highlightedMetrics = [],
  showBudgetColumns = false,
  isExpandedView = false,
}: CashFlowTableProps) => {
  const [colWidth, setColWidth] = useState(220);
  const [dragging, setDragging] = useState(false);
  const [openExpandedModal, setOpenExpandedModal] = useState(false);
  const { valueMode } = useValueDisplay();
  const { isColumnHovered, tableHoverProps } = useFinancialTableHover();

  const getMonthKey = (month: CashFlowMonth) =>
    String(month.dateMonth ?? month.name);

  const translatedMonths: CashFlowMonth[] = useMemo(() => {
    const periods = new Map<number, CashFlowMonth>();
    [realizadoMonths, budgetMonths, variationMonths].forEach((months) => {
      months.forEach((month) => {
        if (month.dateMonth < 1 || month.dateMonth > 13) return;
        if (!periods.has(month.dateMonth)) periods.set(month.dateMonth, month);
      });
    });

    return Array.from(periods.values())
      .sort((a, b) => a.dateMonth - b.dateMonth)
      .map((month) => ({
        ...month,
        translatedName:
          monthNameToPTBR[month.name] ||
          (month.dateMonth === 13 ? "Acumulado" : month.name),
      }));
  }, [budgetMonths, realizadoMonths, variationMonths]);

  const rollingAnnual = annual?.type === "rolling" ? annual : null;
  const annualColumns = useMemo(() => {
    const columns = [...(rollingAnnual?.columns ?? [])].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    if (showBudgetColumns) return columns;
    const rolling = columns.find((column) => column.key === "rolling");
    return rolling ? [rolling] : [];
  }, [rollingAnnual, showBudgetColumns]);

  const monthOptions = useMemo(
    () =>
      translatedMonths.map((month) => ({
        key: String(month.dateMonth ?? month.name),
        label: String(month.translatedName ?? month.name),
      })),
    [translatedMonths],
  );

  const {
    hiddenMonthKeys,
    showAllMonths,
    hideAllMonths,
    toggleMonthVisibility,
  } = useMonthVisibility("cashFlowTable.hiddenMonths", monthOptions);

  const visibleMonths = useMemo(() => {
    const hidden = new Set(hiddenMonthKeys);
    return translatedMonths.filter(
      (month) => !hidden.has(String(month.dateMonth ?? month.name)),
    );
  }, [hiddenMonthKeys, translatedMonths]);

  const formatValue = (label: string, value: number | undefined): string => {
    if (value === undefined || value === null) return "-";

    let adjusted = value;
    if (valueMode === "MILHAR") adjusted /= 1000;
    if (valueMode === "MILHARES") adjusted /= 1000000;

    const abs = Math.abs(adjusted);

    if (label.includes("%")) {
      return `${adjusted.toFixed(2).replace(".", ",")}%`;
    }

    if (adjusted < 0) {
      return `(${Math.trunc(abs).toLocaleString("pt-BR")})`;
    }

    return Math.trunc(adjusted).toLocaleString("pt-BR");
  };

  const findMonth = (list: CashFlowMonth[], dateMonth: number) =>
    list.find((month) => month.dateMonth === dateMonth) ?? null;

  const hasAnyMetricValue = (metric: string) => {
    return visibleMonths.some((month) => {
      const real = findMonth(realizadoMonths, month.dateMonth)?.[metric] as
        | number
        | undefined;

      const budgetMonth = findMonth(budgetMonths, month.dateMonth);
      const variationMonth = findMonth(variationMonths, month.dateMonth);

      const budget = budgetMonth?.[metric] as number | undefined;
      const variation = variationMonth?.[metric] as number | undefined;

      return (
        (real !== undefined && real !== null) ||
        (budget !== undefined && budget !== null) ||
        (variation !== undefined && variation !== null)
      );
    }) ||
      annualColumns.some(
        (column) => getAnnualMetricValue(column, metric) !== null,
      );
  };

  const renderValueCells = (
    month: CashFlowMonth,
    metric: string,
    isSubtotal: boolean,
  ) => {
    const realMonth = findMonth(realizadoMonths, month.dateMonth);
    const realValue = formatValue(
      metric,
      realMonth?.[metric] as number | undefined,
    );
    const monthKey = getMonthKey(month);
    const subtotalBackground = isSubtotal
      ? FINANCIAL_TABLE_COLORS.subtotal
      : undefined;

    if (!showBudgetColumns) {
      const columnKey = `${monthKey}:realizado`;
      return (
        <TableCell
          data-financial-hover-cell={!isSubtotal}
          data-financial-column={columnKey}
          key={`${month.name}-${metric}`}
          align="right"
          sx={{
            ...getFinancialValueCellSx(
              "realizado",
              false,
              subtotalBackground,
            ),
            fontWeight: isSubtotal ? 600 : 400,
            ...getFinancialColumnHoverSx(
              !isSubtotal && isColumnHovered(columnKey),
            ),
          }}
        >
          {realValue}
        </TableCell>
      );
    }

    const budgetMonth = findMonth(budgetMonths, month.dateMonth);
    const variationMonth = findMonth(variationMonths, month.dateMonth);

    const budgetValue = formatValue(
      metric,
      budgetMonth?.[metric] as number | undefined,
    );
    const variationValue = formatValue(
      metric,
      variationMonth?.[metric] as number | undefined,
    );

    return (
      <React.Fragment key={`${monthKey}-${metric}`}>
        <TableCell
          data-financial-hover-cell={!isSubtotal}
          data-financial-column={`${monthKey}:orcado`}
          align="right"
          sx={{
            ...getFinancialValueCellSx(
              "orcado",
              false,
              subtotalBackground,
            ),
            fontWeight: isSubtotal ? 600 : 400,
            ...getFinancialColumnHoverSx(
              !isSubtotal && isColumnHovered(`${monthKey}:orcado`),
            ),
          }}
        >
          {budgetValue}
        </TableCell>
        <TableCell
          data-financial-hover-cell={!isSubtotal}
          data-financial-column={`${monthKey}:realizado`}
          align="right"
          sx={{
            ...getFinancialValueCellSx(
              "realizado",
              false,
              subtotalBackground,
            ),
            fontWeight: isSubtotal ? 600 : 400,
            ...getFinancialColumnHoverSx(
              !isSubtotal && isColumnHovered(`${monthKey}:realizado`),
            ),
          }}
        >
          {realValue}
        </TableCell>
        <TableCell
          data-financial-hover-cell={!isSubtotal}
          data-financial-column={`${monthKey}:variacao`}
          align="right"
          sx={{
            ...getFinancialValueCellSx(
              "variacao",
              true,
              subtotalBackground,
            ),
            fontWeight: isSubtotal ? 600 : 400,
            ...getFinancialColumnHoverSx(
              !isSubtotal && isColumnHovered(`${monthKey}:variacao`),
            ),
          }}
        >
          {variationValue}
        </TableCell>
      </React.Fragment>
    );
  };

  const renderAnnualCells = (metric: string, isSubtotal: boolean) => {
    const subtotalBackground = isSubtotal
      ? FINANCIAL_TABLE_COLORS.subtotal
      : undefined;

    return annualColumns.map((column, columnIndex) => {
      const columnKey = `annual:${column.key}`;
      return (
        <TableCell
          data-financial-hover-cell={!isSubtotal}
          data-financial-column={columnKey}
          key={`${column.key}-${metric}`}
          align="right"
          sx={{
            ...getFinancialValueCellSx(
              column.key,
              showBudgetColumns && columnIndex === annualColumns.length - 1,
              subtotalBackground,
            ),
            fontWeight: isSubtotal ? 600 : 400,
            ...getFinancialColumnHoverSx(
              !isSubtotal && isColumnHovered(columnKey),
            ),
          }}
        >
          {formatValue(
            metric,
            getAnnualMetricValue(column, metric) ?? undefined,
          )}
        </TableCell>
      );
    });
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setColWidth((prev) => Math.min(450, Math.max(120, prev + e.movementX)));
    }
  };
  const handleMouseUp = () => setDragging(false);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const showEmptyState =
    (visibleMonths.length === 0 && annualColumns.length === 0) ||
    !metricKeys.some((metric) => hasAnyMetricValue(metric));

  return (
    <>
      <MonthTableControls
        monthOptions={monthOptions}
        hiddenMonthKeys={hiddenMonthKeys}
        onShowAllMonths={showAllMonths}
        onHideAllMonths={hideAllMonths}
        onToggleMonth={toggleMonthVisibility}
        onExpand={() => setOpenExpandedModal(true)}
        expandDisabled={
          translatedMonths.length === 0 && annualColumns.length === 0
        }
        hideExpand={isExpandedView}
      />

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxHeight: isExpandedView ? "calc(100vh - 190px)" : 650,
          border: "1px solid #e0e0e0",
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
                border: "1px solid #e0e0e0",
                height: 40,
                width: colWidth,
                minWidth: colWidth,
                maxWidth: colWidth,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Descrição</span>
                <div
                  onMouseDown={handleMouseDown}
                  style={{ cursor: "col-resize", padding: "0 4px" }}
                >
                  ⋮
                </div>
              </div>
            </TableCell>

            {visibleMonths.map((m) => (
              <TableCell
                key={getMonthKey(m)}
                align="center"
                colSpan={showBudgetColumns ? 3 : 1}
                sx={getFinancialMonthHeaderSx(showBudgetColumns)}
              >
                {m.translatedName}
              </TableCell>
            ))}
            {rollingAnnual && annualColumns.length > 0 && (
              <TableCell
                key={`annual-${rollingAnnual.year}`}
                align="center"
                colSpan={annualColumns.length}
                sx={getFinancialMonthHeaderSx(showBudgetColumns)}
              >
                {showBudgetColumns ? String(rollingAnnual.year) : "Rolling"}
              </TableCell>
            )}
          </TableRow>

          {showBudgetColumns && (
            <TableRow>
              <TableCell
                sx={{
                  ...FINANCIAL_STICKY_HEAD_FIRST_CELL_SX,
                  border: "1px solid #e0e0e0",
                  top: 40,
                  width: colWidth,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                }}
              />
              {visibleMonths.map((m) => (
                <React.Fragment key={getMonthKey(m)}>
                  <TableCell
                    align="right"
                    sx={getFinancialMetricHeaderSx(false)}
                  >
                    Orçado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={getFinancialMetricHeaderSx(false)}
                  >
                    Realizado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={getFinancialMetricHeaderSx(true)}
                  >
                    Variação
                  </TableCell>
                </React.Fragment>
              ))}
              {annualColumns.map((column, columnIndex) => (
                <TableCell
                  key={`annual-${column.key}`}
                  align="right"
                  sx={getFinancialMetricHeaderSx(
                    columnIndex === annualColumns.length - 1,
                  )}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableHead>

        <TableBody>
          {metricKeys
            .filter((metric) => hasAnyMetricValue(metric))
            .map((metric) => {
              const highlighted = highlightedMetrics.includes(metric);
              return (
                <TableRow
                  key={metric}
                  sx={{
                    backgroundColor: highlighted
                      ? FINANCIAL_TABLE_COLORS.subtotal
                      : undefined,
                  }}
                >
                  <TableCell
                    sx={{
                      ...FINANCIAL_STICKY_FIRST_CELL_SX,
                      width: colWidth,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                      backgroundColor: highlighted
                        ? FINANCIAL_TABLE_COLORS.subtotal
                        : FINANCIAL_TABLE_COLORS.actual,
                      fontWeight: highlighted ? 600 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Tooltip title={metricLabels[metric] || metric}>
                      <span>{metricLabels[metric] || metric}</span>
                    </Tooltip>
                  </TableCell>

                  {visibleMonths.map((month) =>
                    renderValueCells(month, metric, highlighted),
                  )}
                  {renderAnnualCells(metric, highlighted)}
                </TableRow>
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
            Fluxo de Caixa
            <IconButton
              aria-label="Fechar tabela expandida"
              onClick={() => setOpenExpandedModal(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2.5, pt: 1 }}>
            <CashFlowTable
              realizadoMonths={realizadoMonths}
              budgetMonths={budgetMonths}
              variationMonths={variationMonths}
              annual={annual}
              metricKeys={metricKeys}
              metricLabels={metricLabels}
              highlightedMetrics={highlightedMetrics}
              showBudgetColumns={showBudgetColumns}
              isExpandedView
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
