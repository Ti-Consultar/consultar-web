import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import { useValueDisplay } from "../../contexts/ValueDisplayContext";

interface MonthView {
  [key: string]: number;
}

interface MonthData {
  name: string;
  translatedName?: string;
  realizado?: MonthView;
  orcado?: MonthView;
  variacao?: MonthView;
  [key: string]: any;
}

interface ResultsTableProps {
  months: MonthData[];
  metricKeys: string[];
  metricLabels: Record<string, string>;
  nestedMetrics?: Record<string, string[]>;
  enableValueMode?: boolean;
  metricTypes?: Record<string, "number" | "percent" | "indicator">;
  highlightRows?: Record<string, boolean>;
  showBudgetColumns?: boolean;
  metricNature?: Record<string, "receita" | "despesa">;
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
  JANUARY: "Janeiro",
  FEBRUARY: "Fevereiro",
  MARCH: "Março",
  APRIL: "Abril",
  MAY: "Maio",
  JUNE: "Junho",
  JULY: "Julho",
  AUGUST: "Agosto",
  SEPTEMBER: "Setembro",
  OCTOBER: "Outubro",
  NOVEMBER: "Novembro",
  DECEMBER: "Dezembro",
  ACUMULADO: "YTD",
};

export const ResultsTableVariation = ({
  months,
  metricKeys,
  metricLabels,
  nestedMetrics = {},
  enableValueMode = true,
  metricTypes = {},
  highlightRows = {},
  showBudgetColumns = false,
}: ResultsTableProps) => {
  const [colWidth, setColWidth] = useState(220);
  const [dragging, setDragging] = useState(false);
  const { valueMode } = useValueDisplay();

  const translatedMonths: MonthData[] = useMemo(() => {
    // Conjunto de chaves que são MÉTRICAS válidas (ignora name/dateMonth)
    const metricUniverse = new Set<string>([
      ...metricKeys,
      ...Object.values(nestedMetrics).flat(),
    ]);

    // Se quiser garantir que meta-campos nunca contem:
    const isMetricKey = (k: string) =>
      metricUniverse.has(k) && k !== "name" && k !== "dateMonth";

    // Checa se há ALGUM valor (≠ 0) em realizado/orcado/variacao
    const hasAnyValue = (month: MonthData) => {
      const views = ["realizado", "orcado", "variacao"] as const;

      return views.some((view) => {
        const group = month[view];
        if (!group || typeof group !== "object") return false;

        // Verifica SOMENTE chaves de métricas conhecidas
        for (const key of Object.keys(group)) {
          if (!isMetricKey(key)) continue;
          const val = (group as Record<string, unknown>)[key];

          // Aceita apenas números finitos e diferentes de zero
          if (typeof val === "number" && Number.isFinite(val) && val !== 0) {
            return true;
          }
        }
        return false;
      });
    };

    return months
      .filter((m) => hasAnyValue(m))
      .map((month) => ({
        ...month,
        translatedName: monthNameToPTBR[month.name] || month.name,
      }));
  }, [months, metricKeys, nestedMetrics]);

  const allNestedKeys = Object.values(nestedMetrics).flat();

  const nestedGroupOrder = useMemo(() => {
    const order = ["cil", "estruturaDeCapital"];
    return order.filter((key) => key in nestedMetrics);
  }, [nestedMetrics]);

  const nestedGroupLabels: Record<string, string> = {
    estruturaDeCapital: "Posição Financeira Líquida",
    cil: "Capital Investido Líquido",
  };

  const formatValue = (metricKey: string, value: number): string => {
    if (value === 0 || value === undefined || value === null) return "-";

    if (metricTypes[metricKey] === "percent") {
      const formattedPercent =
        Math.abs(value).toFixed(2).replace(".", ",") + "%";
      return value < 0 ? `(${formattedPercent})` : formattedPercent;
    }

    if (metricTypes[metricKey] === "indicator") {
      const formatted = value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return value < 0 ? `(${formatted})` : formatted;
    }

    let adjustedValue = Math.abs(value);
    if (enableValueMode) {
      if (valueMode === "MILHAR") adjustedValue /= 1000;
      else if (valueMode === "MILHARES") adjustedValue /= 1000000;
    }

    const formatted = adjustedValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return value < 0 ? `(${formatted})` : formatted;
  };

  const getMetricValue = (
    month: MonthData,
    metric: string,
    view: "realizado" | "orcado" | "variacao" = "realizado"
  ) => {
    const targetGroup = month[view];
    if (!targetGroup) return "-";
    const rawValue = targetGroup[metric];
    return typeof rawValue === "number" ? formatValue(metric, rawValue) : "-";
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setColWidth((prev) => Math.min(450, Math.max(120, prev + e.movementX)));
    }
  };
  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const baseCellStyle = {
    borderLeft: "1px solid #e0e0e0",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: "#d6e9e0ff",
    },
  };

  const renderValueCells = (month: MonthData, metric: string) => {
    if (!showBudgetColumns) {
      const value = getMetricValue(month, metric, "realizado");
      return (
        <TableCell
          key={`${month.name}-${metric}`}
          align="right"
          sx={baseCellStyle}
        >
          {value}
        </TableCell>
      );
    }

    const real = getMetricValue(month, metric, "realizado");
    const orcado = getMetricValue(month, metric, "orcado");
    const variacao = getMetricValue(month, metric, "variacao");

    return (
      <>
        <TableCell
          key={`${month.name}-${metric}-orcado`}
          align="right"
          sx={baseCellStyle}
        >
          {orcado}
        </TableCell>
        <TableCell
          key={`${month.name}-${metric}-real`}
          align="right"
          sx={baseCellStyle}
        >
          {real}
        </TableCell>
        <TableCell
          key={`${month.name}-${metric}-var`}
          align="right"
          sx={{
            ...baseCellStyle,
            minWidth: 110,
            whiteSpace: "nowrap",
          }}
        >
          {variacao}
        </TableCell>
      </>
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        overflow: "auto",
      }}
    >
      <Table size="small" sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
                position: "sticky",
                left: 0,
                zIndex: 2,
                width: colWidth,
                minWidth: colWidth,
                maxWidth: colWidth,
                userSelect: "none",
                cursor: dragging ? "col-resize" : "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Índice</span>
                <div
                  onMouseDown={handleMouseDown}
                  style={{
                    cursor: "col-resize",
                    padding: "0 4px",
                    marginRight: -8,
                  }}
                >
                  ⋮
                </div>
              </div>
            </TableCell>

            {translatedMonths.map((month) => (
              <TableCell
                key={month.name}
                align="center"
                colSpan={showBudgetColumns ? 3 : 1}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  borderLeft: "1px solid #e0e0e0",
                  whiteSpace: "nowrap",
                }}
              >
                {month.translatedName}
              </TableCell>
            ))}
          </TableRow>

          {showBudgetColumns && (
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#fafafa",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                }}
              ></TableCell>
              {translatedMonths.map((month) => (
                <React.Fragment key={`${month.name}-sub`}>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #e0e0e0",
                      borderLeft: "1px solid #e0e0e0",
                    }}
                  >
                    Orçado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    Realizado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Variação
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          )}
        </TableHead>

        <TableBody>
          {nestedGroupOrder.map((groupKey) => {
            const metrics = nestedMetrics[groupKey];
            return (
              <React.Fragment key={groupKey}>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: "#fafafa",
                      fontWeight: "bold",
                      width: colWidth,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    <Tooltip
                      title={
                        nestedGroupLabels[groupKey] ||
                        metricLabels[groupKey] ||
                        groupKey
                      }
                    >
                      <span>
                        {nestedGroupLabels[groupKey] ||
                          metricLabels[groupKey] ||
                          groupKey}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    colSpan={
                      translatedMonths.length * (showBudgetColumns ? 3 : 1)
                    }
                    sx={{
                      backgroundColor: "#fafafa",
                      borderLeft: "1px solid #e0e0e0",
                      p: 0,
                    }}
                  />
                </TableRow>

                {metrics.map((metric) => {
                  const isHighlighted = !!highlightRows[metric];
                  return (
                    <TableRow
                      key={`${groupKey}-${metric}`}
                      sx={{
                        backgroundColor: isHighlighted ? "#f5f5f5" : undefined,
                      }}
                    >
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: isHighlighted ? "#f5f5f5" : "#fff",
                          fontWeight: isHighlighted ? "bold" : 500,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={metricLabels[metric] || metric}>
                          <span>{metricLabels[metric] || metric}</span>
                        </Tooltip>
                      </TableCell>

                      {translatedMonths.map((month) =>
                        renderValueCells(month, metric)
                      )}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}

          {metricKeys
            .filter((metric) => !allNestedKeys.includes(metric))
            .map((metric) => {
              const isHighlighted = !!highlightRows[metric];
              return (
                <TableRow
                  key={metric}
                  sx={{
                    backgroundColor: isHighlighted ? "#f5f5f5" : undefined,
                  }}
                >
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: isHighlighted ? "#f5f5f5" : "#fff",
                      fontWeight: isHighlighted ? "bold" : 500,
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Tooltip title={metricLabels[metric] || metric}>
                      <span>{metricLabels[metric] || metric}</span>
                    </Tooltip>
                  </TableCell>

                  {translatedMonths.map((month) =>
                    renderValueCells(month, metric)
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
