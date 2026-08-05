import { useState, type MouseEventHandler } from "react";

export const FINANCIAL_TABLE_COLORS = {
  budget: "#F8FAFD",
  actual: "#FFFFFF",
  variation: "#F4F6F8",
  monthHeader: "#EEF3FA",
  metricHeader: "#F7F9FC",
  subtotal: "#F7F9FB",
  total: "#EEF3F8",
  strongBorder: "#AEB8C5",
  hover: "#f5f5fa",
} as const;

export const FINANCIAL_TABLE_HOVER_SX = {
  "& .MuiTableRow-root:hover > .MuiTableCell-root[data-financial-hover-cell='true']": {
    backgroundColor: `${FINANCIAL_TABLE_COLORS.hover} !important`,
  },
} as const;

export const getFinancialColumnHoverSx = (isHovered: boolean) =>
  isHovered
    ? { backgroundColor: FINANCIAL_TABLE_COLORS.hover }
    : {};

export const useFinancialTableHover = () => {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const onMouseOver: MouseEventHandler<HTMLTableElement> = (event) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-financial-hover-cell='true']",
    );
    setHoveredColumn(cell?.dataset.financialColumn ?? null);
  };

  const onMouseLeave = () => setHoveredColumn(null);

  const isColumnHovered = (columnKey: string) => {
    if (!hoveredColumn) return false;
    if (hoveredColumn === columnKey) return true;

    const [hoveredPeriod, hoveredScenario] = hoveredColumn.split(":");
    const [columnPeriod, columnScenario] = columnKey.split(":");
    return (
      hoveredPeriod === columnPeriod &&
      (hoveredScenario === "*" || columnScenario === "*")
    );
  };

  return {
    isColumnHovered,
    tableHoverProps: { onMouseOver, onMouseLeave },
  };
};

export const FINANCIAL_STICKY_HEAD_FIRST_CELL_SX = {
  position: "sticky" as const,
  top: 0,
  left: 0,
  zIndex: 260,
  minWidth: 280,
  backgroundColor: FINANCIAL_TABLE_COLORS.monthHeader,
  fontWeight: 700,
  backgroundClip: "padding-box",
} as const;

export const FINANCIAL_STICKY_FIRST_CELL_SX = {
  position: "sticky" as const,
  left: 0,
  zIndex: 150,
  minWidth: 280,
  maxWidth: 360,
  backgroundColor: FINANCIAL_TABLE_COLORS.actual,
  backgroundClip: "padding-box",
} as const;

const metricBackgrounds: Record<string, string> = {
  orcado: FINANCIAL_TABLE_COLORS.budget,
  realizado: FINANCIAL_TABLE_COLORS.actual,
  variacao: FINANCIAL_TABLE_COLORS.variation,
};

export const getMetricBackground = (scenarioKey: string) =>
  metricBackgrounds[scenarioKey] ?? FINANCIAL_TABLE_COLORS.actual;

export const getFinancialMonthHeaderSx = (showStrongBorder: boolean) => ({
  position: "sticky" as const,
  top: 0,
  zIndex: 200,
  height: 40,
  minWidth: 112,
  backgroundColor: FINANCIAL_TABLE_COLORS.monthHeader,
  border: "1px solid rgba(224, 224, 224, 1)",
  borderRight: showStrongBorder
    ? `2px solid ${FINANCIAL_TABLE_COLORS.strongBorder}`
    : "1px solid rgba(224, 224, 224, 1)",
  fontWeight: 700,
  textAlign: "center" as const,
});

export const getFinancialMetricHeaderSx = (
  isPeriodEnd: boolean,
) => ({
  position: "sticky" as const,
  top: 40,
  zIndex: 200,
  minWidth: 112,
  backgroundColor: FINANCIAL_TABLE_COLORS.metricHeader,
  border: "1px solid rgba(224, 224, 224, 1)",
  borderRight: isPeriodEnd
    ? `2px solid ${FINANCIAL_TABLE_COLORS.strongBorder}`
    : "1px solid rgba(224, 224, 224, 1)",
  fontWeight: 600,
  textAlign: "right" as const,
});

export const getFinancialValueCellSx = (
  scenarioKey: string,
  isPeriodEnd: boolean,
  rowBackground?: string,
) => ({
  minWidth: 112,
  backgroundColor: rowBackground ?? getMetricBackground(scenarioKey),
  border: "1px solid rgba(224, 224, 224, 1)",
  borderRight: isPeriodEnd
    ? `2px solid ${FINANCIAL_TABLE_COLORS.strongBorder}`
    : "1px solid rgba(224, 224, 224, 1)",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap" as const,
});
