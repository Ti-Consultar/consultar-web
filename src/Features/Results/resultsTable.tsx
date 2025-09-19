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

interface MonthData {
  name: string;
  translatedName?: string;
  [key: string]: any;
}

interface TabelaMetricasTranspostaProps {
  months: MonthData[];
  metricKeys: string[];
  metricLabels: Record<string, string>;
  nestedMetrics?: Record<string, string[]>;
  enableValueMode?: boolean;
  metricTypes?: Record<string, "number" | "percent">;
  highlightRows?: Record<string, boolean>;
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
};

export const ResultsTable = ({
  months,
  metricKeys,
  metricLabels,
  nestedMetrics = {},
  enableValueMode = true,
  metricTypes = {},
  highlightRows = {},
}: TabelaMetricasTranspostaProps) => {
  const [colWidth, setColWidth] = useState(220); 
  const [dragging, setDragging] = useState(false);
  const translatedMonths: MonthData[] = useMemo(
    () =>
      months.map((month) => ({
        ...month,
        translatedName: monthNameToPTBR[month.name] || month.name,
      })),
    [months]
  );

  const allNestedKeys = Object.values(nestedMetrics).flat();
  const { valueMode } = useValueDisplay();

  const nestedGroupOrder = useMemo(() => {
    const month = months?.[0];
    if (!month || !nestedMetrics) return [];
    return Object.keys(month).filter((key) => key in nestedMetrics);
  }, [months, nestedMetrics]);

  const nestedGroupLabels: Record<string, string> = {
    estruturaDeCapital: "Posição Financeira Líquida",
    cil: "Capital Investido Líquido",
  };

  const formatValue = (metricKey: string, value: number): string => {
    if (value === 0) return "-";

    if (metricTypes[metricKey] === "percent") {
      const formattedPercent =
        Math.abs(value).toFixed(2).replace(".", ",") + "%";

      return value < 0 ? `(${formattedPercent})` : formattedPercent;
    }

    let adjustedValue = Math.abs(value);

    if (enableValueMode) {
      if (valueMode === "MILHAR") adjustedValue /= 1000;
      else if (valueMode === "MILHARES") adjustedValue /= 1000000;
    }

    const formatted = adjustedValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (value < 0) return `(${formatted})`;
    return formatted;
  };

  const handleMouseDown = () => setDragging(true);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setColWidth((prev) => Math.max(120, prev + e.movementX));
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
                zIndex: 1,
                width: colWidth,
                minWidth: colWidth,
                maxWidth: colWidth,
                userSelect: "none",
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
                align="right"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #e0e0e0",
                }}
              >
                {month.translatedName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Grupos aninhados */}
          {nestedGroupOrder.map((groupKey) => {
            const metrics = nestedMetrics[groupKey];
            const stickyTop = 0;

            return (
              <React.Fragment key={groupKey}>
                <TableRow>
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      top: stickyTop,
                      zIndex: 3,
                      fontWeight: "bold",
                      backgroundColor: "#fafafa",
                      width: colWidth,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
                    colSpan={translatedMonths.length}
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
                        backgroundColor: isHighlighted
                          ? "#f5f5f5"
                          : "transparent",
                        fontWeight: isHighlighted ? "bold" : "normal",
                      }}
                    >
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: isHighlighted ? "#f5f5f5" : "#fff",
                          fontWeight: isHighlighted ? "bold" : 500,
                          width: colWidth,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={metricLabels[metric] || metric}>
                          <span>{metricLabels[metric] || metric}</span>
                        </Tooltip>
                      </TableCell>

                      {translatedMonths.map((month) => {
                        const rawValue = month[groupKey]?.[metric];
                        const value =
                          typeof rawValue === "number"
                            ? formatValue(metric, rawValue)
                            : "-";
                        return (
                          <TableCell
                            key={`${month.name}-${metric}`}
                            align="right"
                            sx={{
                              borderLeft: "1px solid #e0e0e0",
                              "&:hover": { backgroundColor: "#f0f0f0" },
                            }}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Métricas isoladas */}
          {metricKeys
            .filter((metric) => !allNestedKeys.includes(metric))
            .map((metric) => {
              const isHighlighted = !!highlightRows[metric];
              return (
                <TableRow
                  key={metric}
                  sx={{
                    backgroundColor: isHighlighted ? "#f5f5f5" : "transparent",
                    fontWeight: isHighlighted ? "bold" : "normal",
                  }}
                >
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: isHighlighted ? "#f5f5f5" : "#fff",
                      fontWeight: isHighlighted ? "bold" : 500,
                      width: colWidth,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Tooltip title={metricLabels[metric] || metric}>
                      <span>{metricLabels[metric] || metric}</span>
                    </Tooltip>
                  </TableCell>
                  {translatedMonths.map((month) => {
                    const rawValue = month[metric];
                    const value =
                      typeof rawValue === "number"
                        ? formatValue(metric, rawValue)
                        : "-";
                    return (
                      <TableCell
                        key={`${month.name}-${metric}`}
                        align="right"
                        sx={{
                          borderLeft: "1px solid #e0e0e0",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
