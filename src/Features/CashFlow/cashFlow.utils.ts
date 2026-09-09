import type { CashFlowAnnual, CashFlowAnnualColumn, CashFlowMonth } from "./table";
import { monthTranslator } from "../../utils/formatters/monthTranslator.ts";

export const getAnnualMetricValue = (
  column: CashFlowAnnualColumn,
  metric: string,
): number | null => {
  if (!column.value || typeof column.value !== "object") return null;
  const value = column.value as Record<string, unknown>;
  const directValue = value[metric];
  if (typeof directValue === "number") return directValue;

  const cashFlow = value.cashFlow;
  if (!cashFlow || typeof cashFlow !== "object") return null;
  const nestedValue = (cashFlow as Record<string, unknown>)[metric];
  return typeof nestedValue === "number" ? nestedValue : null;
};

interface CashFlowExportRow {
  name: string;
  values: Record<string, number | string>;
}

interface CashFlowExportColumn {
  label: string;
  accessor: (row: CashFlowExportRow) => number | string;
}

interface CashFlowExportOptions {
  realizado: CashFlowMonth[];
  orcado: CashFlowMonth[];
  variacao: CashFlowMonth[];
  annual: CashFlowAnnual | null;
  metricKeys: string[];
  metricLabels: Record<string, string>;
}

export const buildCashFlowExportData = ({
  realizado,
  orcado,
  variacao,
  annual,
  metricKeys,
  metricLabels,
}: CashFlowExportOptions): {
  columns: CashFlowExportColumn[];
  rows: CashFlowExportRow[];
} => {
  const scenarios = [
    { key: "orcado", label: "Orçado", months: orcado },
    { key: "realizado", label: "Realizado", months: realizado },
    { key: "variacao", label: "Variação", months: variacao },
  ];
  // Match the table by period number, including periods found only in Budget.
  const periods = new Map<number, CashFlowMonth>();
  [realizado, orcado, variacao].forEach((months) => {
    months.forEach((month) => {
      if (month.dateMonth < 1 || month.dateMonth > 13) return;
      if (!periods.has(month.dateMonth)) periods.set(month.dateMonth, month);
    });
  });

  const valueColumns: {
    key: string;
    label: string;
    getValue: (metric: string) => number | string;
  }[] = [];

  Array.from(periods.values())
    .sort((a, b) => a.dateMonth - b.dateMonth)
    .forEach((period) => {
      const periodLabel = period.dateMonth === 13
        ? "YTD"
        : monthTranslator[period.name] ?? period.name;
      scenarios.forEach((scenario) => {
        const month = scenario.months.find(
          (item) => item.dateMonth === period.dateMonth,
        );
        valueColumns.push({
          key: `${period.dateMonth}:${scenario.key}`,
          label: `${periodLabel} - ${scenario.label}`,
          getValue: (metric) => month?.[metric] ?? "-",
        });
      });
    });

  if (annual?.type === "rolling") {
    [...annual.columns]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((column) => {
        valueColumns.push({
          key: `annual:${column.key}`,
          label: `${annual.year} - ${column.label}`,
          getValue: (metric) => getAnnualMetricValue(column, metric) ?? "-",
        });
      });
  }

  if (!valueColumns.length) return { columns: [], rows: [] };

  return {
    columns: [
      { label: "Conta", accessor: (row) => row.name },
      ...valueColumns.map(({ key, label }) => ({
        label,
        accessor: (row: CashFlowExportRow) => row.values[key] ?? "-",
      })),
    ],
    rows: metricKeys.map((metric) => ({
      name: metricLabels[metric] ?? metric,
      values: Object.fromEntries(
        valueColumns.map((column) => [column.key, column.getValue(metric)]),
      ),
    })),
  };
};
