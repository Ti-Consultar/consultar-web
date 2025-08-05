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
import React, { useMemo } from "react";

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
  valueFormatter?: (value: number) => string;
  highlightedMetrics?: string[];
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

export const CashFlowTable = ({
  months,
  metricKeys,
  metricLabels,
  nestedMetrics = {},
  valueFormatter = (val) => {
    const formatted = Math.abs(val).toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    });
    return val < 0 ? `(${formatted})` : formatted;
  },
  highlightedMetrics = [],
}: TabelaMetricasTranspostaProps) => {
  const translatedMonths: MonthData[] = useMemo(
    () =>
      months.map((month) => ({
        ...month,
        translatedName: monthNameToPTBR[month.name] || month.name,
      })),
    [months]
  );

  const allNestedKeys = Object.values(nestedMetrics).flat();

  const nestedGroupOrder = useMemo(() => {
    const month = months?.[0];
    if (!month || !nestedMetrics) return [];

    return Object.keys(month).filter((key) => key in nestedMetrics);
  }, [months, nestedMetrics]);

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
              }}
            >
              Índice
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
          {/* Renderizar grupos aninhados na ordem definida */}
          {nestedGroupOrder.map((groupKey) => {
            const metrics = nestedMetrics[groupKey];
            return (
              <React.Fragment key={groupKey}>
                <TableRow>
                  <TableCell
                    colSpan={translatedMonths.length + 1}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {metricLabels[groupKey] || groupKey}
                  </TableCell>
                </TableRow>
                {metrics.map((metric) => {
                  const isHighlighted = highlightedMetrics.includes(metric);
                  return (
                    <TableRow
                      key={`${groupKey}-${metric}`}
                      sx={{
                        backgroundColor: isHighlighted ? "#f0f0f0" : undefined,
                      }}
                    >
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: isHighlighted ? "#f0f0f0" : "#fff",
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: isHighlighted ? "bold" : 500,
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
                            ? valueFormatter(rawValue)
                            : "-";
                        return (
                          <TableCell
                            key={`${month.name}-${metric}`}
                            align="right"
                            sx={{
                              borderLeft: "1px solid #e0e0e0",
                              fontWeight: isHighlighted ? "bold" : undefined,
                              backgroundColor: isHighlighted
                                ? "#f0f0f0"
                                : undefined,
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

          {/* Renderizar métricas isoladas (não agrupadas) */}
          {metricKeys
            .filter((metric) => !allNestedKeys.includes(metric))
            .map((metric) => {
              const isHighlighted = highlightedMetrics.includes(metric);
              return (
                <TableRow
                  key={metric}
                  sx={{
                    backgroundColor: isHighlighted ? "#f0f0f0" : undefined,
                  }}
                >
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: isHighlighted ? "#f0f0f0" : "#fff",
                      maxWidth: 180,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: isHighlighted ? "bold" : 500,
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
                        ? valueFormatter(rawValue)
                        : "-";
                    return (
                      <TableCell
                        key={`${month.name}-${metric}`}
                        align="right"
                        sx={{
                          borderLeft: "1px solid #e0e0e0",
                          fontWeight: isHighlighted ? "bold" : undefined,
                          backgroundColor: isHighlighted
                            ? "#f0f0f0"
                            : undefined,
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
