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
  const { valueMode } = useValueDisplay();

  const nestedGroupOrder = useMemo(() => {
    const month = months?.[0];
    if (!month || !nestedMetrics) return [];

    return Object.keys(month).filter((key) => key in nestedMetrics);
  }, [months, nestedMetrics]);

  // Novo formatValue que ignora formatação em porcentagens
  const formatValue = (classificationName: string, value: number): string => {
    if (value === 0) return "-";

    // Não formata porcentagem
    if (classificationName.includes("%")) {
      return `${value.toFixed(2).replace(".", ",")}%`;
    }

    let adjustedValue = Math.abs(value);

    if (valueMode === "MILHAR") adjustedValue /= 1000;
    else if (valueMode === "MILHARES") adjustedValue /= 1000000;

    if (classificationName.startsWith("(-)"))
      return `(${Math.trunc(adjustedValue).toLocaleString("pt-BR")})`;

    return Math.trunc(adjustedValue).toLocaleString("pt-BR");
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
          {/* Renderizar grupos aninhados */}
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
                {metrics.map((metric) => (
                  <TableRow key={`${groupKey}-${metric}`}>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#fff",
                        maxWidth: 180,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 500,
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
                          ? formatValue(
                              metricLabels[metric] || metric,
                              rawValue
                            )
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
                ))}
              </React.Fragment>
            );
          })}

          {/* Renderizar métricas isoladas */}
          {metricKeys
            .filter((metric) => !allNestedKeys.includes(metric))
            .map((metric) => (
              <TableRow key={metric}>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: "#fff",
                    maxWidth: 180,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 500,
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
                      ? formatValue(metricLabels[metric] || metric, rawValue)
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
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
