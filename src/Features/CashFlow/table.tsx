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
import React, { useMemo, useState } from "react";
import { useValueDisplay } from "../../contexts/ValueDisplayContext";

interface CashFlowMonth {
  name: string;
  dateMonth: number;
  [key: string]: number | string;
}

interface CashFlowTableProps {
  realizadoMonths: CashFlowMonth[];
  budgetMonths: CashFlowMonth[];
  variationMonths: CashFlowMonth[];
  metricKeys: string[];
  metricLabels: Record<string, string>;
  highlightedMetrics?: string[];
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
  ACUMULADO: "Acumulado",
};

export const CashFlowTable = ({
  realizadoMonths,
  budgetMonths,
  variationMonths,
  metricKeys,
  metricLabels,
  highlightedMetrics = [],
  showBudgetColumns = false,
}: CashFlowTableProps) => {
  const [colWidth, setColWidth] = useState(220);
  const [dragging, setDragging] = useState(false);
  const { valueMode } = useValueDisplay();

  const translatedMonths: CashFlowMonth[] = useMemo(
    () =>
      realizadoMonths.map((month) => ({
        ...month,
        translatedName: monthNameToPTBR[month.name] || month.name,
      })),
    [realizadoMonths]
  );

  const formatValue = (label: string, value: number | undefined): string => {
    if (value === undefined || value === null) return "-";
    if (value === 0) return "-";

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

  const findMonth = (
    list: CashFlowMonth[],
    name: string,
    dateMonth: number
  ) => {
    // Tenta encontrar pelo nome
    let month = list.find((m) => m.name === name);

    // Se não encontrou pelo nome, tenta pelo número do mês
    if (!month) {
      month = list.find((m) => m.dateMonth === dateMonth);
    }

    // Só retorna o acumulado se o mês também for "ACUMULADO"
    // (ou se quiser explicitamente que o acumulado substitua o último)
    if (!month && name === "ACUMULADO") {
      month = list.find((m) => m.dateMonth === 13);
    }

    return month;
  };

  const renderValueCells = (month: CashFlowMonth, metric: string) => {
    const realValue = formatValue(metric, month[metric] as number);

    if (!showBudgetColumns) {
      return (
        <TableCell
          key={`${month.name}-${metric}`}
          align="right"
          sx={{ borderRight: "1px solid #e0e0e0" }}
        >
          {realValue}
        </TableCell>
      );
    }

    const budgetMonth = findMonth(budgetMonths, month.name, month.dateMonth);
    const variationMonth = findMonth(
      variationMonths,
      month.name,
      month.dateMonth
    );

    const budgetValue = formatValue(
      metric,
      budgetMonth?.[metric] as number | undefined
    );
    const variationValue = formatValue(
      metric,
      variationMonth?.[metric] as number | undefined
    );

    return (
      <>
        <TableCell align="right" sx={{ borderRight: "1px solid #e0e0e0" }}>
          {budgetValue}
        </TableCell>
        <TableCell align="right" sx={{ borderRight: "1px solid #e0e0e0" }}>
          {realValue}
        </TableCell>
        <TableCell align="right" sx={{ borderRight: "1px solid #e0e0e0" }}>
          {" "}
          {variationValue}
        </TableCell>
      </>
    );
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
      <Table size="small">
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
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span></span>
                <div
                  onMouseDown={handleMouseDown}
                  style={{ cursor: "col-resize", padding: "0 4px" }}
                >
                  ⋮
                </div>
              </div>
            </TableCell>

            {translatedMonths.map((m) => (
              <TableCell
                key={m.name}
                align="center"
                colSpan={showBudgetColumns ? 3 : 1}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  borderLeft: "1px solid #e0e0e0",
                }}
              >
                {m.translatedName}
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
                  borderLeft: "1px solid #e0e0e0",
                }}
              />
              {translatedMonths.map((m) => (
                <React.Fragment key={m.name}>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Orçado
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Realizado
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      borderRight: "1px solid #e0e0e0",
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
          {metricKeys.map((metric) => {
            const highlighted = highlightedMetrics.includes(metric);
            return (
              <TableRow
                key={metric}
                sx={{
                  backgroundColor: highlighted ? "#f0f0f0" : undefined,
                }}
              >
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: highlighted ? "#f0f0f0" : "#fff",
                    fontWeight: highlighted ? "bold" : 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderRight: "1px solid #e0e0e0",
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
