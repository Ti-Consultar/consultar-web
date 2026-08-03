import type {
  ReclassifiedBalanceSheetData,
  ReclassifiedBalanceSheetRow,
  ReclassifiedScenario,
} from "../../../types/reclassifiedBalanceSheetV2";

export const BALANCE_DIFFERENCE_CODE = "BALANCE_DIFFERENCE";

export const FINANCIAL_STATEMENT_TABS = [
  { label: "Balanço Reclassificado", value: 1 },
  { label: "DRE", value: 3 },
] as const;

export const EMPTY_RECLASSIFIED_BALANCE_SHEET_DATA: ReclassifiedBalanceSheetData = {
  periods: [],
  scenarios: [],
  statements: [],
  rows: [],
};

export const sortByDisplayOrder = <T extends { displayOrder: number }>(
  items: readonly T[],
): T[] => [...items].sort((a, b) => a.displayOrder - b.displayOrder);

export const deriveReclassifiedRows = (
  rows: readonly ReclassifiedBalanceSheetRow[],
) => ({
  balanceDifferenceRow: rows.find(
    (row) => row.code === BALANCE_DIFFERENCE_CODE,
  ),
  assetRows: sortByDisplayOrder(
    rows.filter(
      (row) =>
        row.statementKey === "asset" &&
        row.code !== BALANCE_DIFFERENCE_CODE,
    ),
  ),
  liabilityRows: sortByDisplayOrder(
    rows.filter(
      (row) =>
        row.statementKey === "liability" &&
        row.code !== BALANCE_DIFFERENCE_CODE,
    ),
  ),
});

export const getScenarioColumns = (
  scenarios: readonly ReclassifiedScenario[],
  showBudgetColumns: boolean,
) => {
  const sorted = sortByDisplayOrder(scenarios);
  if (!showBudgetColumns) {
    return sorted.filter((scenario) => scenario.key === "realizado");
  }

  const desiredOrder: ReclassifiedScenario["key"][] = [
    "orcado",
    "realizado",
    "variacao",
  ];
  const scenarioByKey = new Map(
    sorted.map((scenario) => [scenario.key, scenario]),
  );
  return desiredOrder.flatMap((key) => {
    const scenario = scenarioByKey.get(key);
    return scenario ? [scenario] : [];
  });
};

export const canExpandReclassifiedRow = (
  row: Pick<ReclassifiedBalanceSheetRow, "expandable">,
) => row.expandable === true;

export type BalanceCheckStatus = "success" | "error" | "neutral";
export type ReclassifiedValueMode = "TOTAL" | "MILHAR" | "MILHARES";

export const formatReclassifiedCurrency = (
  value: number | null | undefined,
  valueMode: ReclassifiedValueMode,
) => {
  if (value === null || value === undefined) return "-";
  if (value === 0) return "0";

  let displayValue = Math.abs(value);
  if (valueMode === "MILHAR") displayValue /= 1_000;
  if (valueMode === "MILHARES") displayValue /= 1_000_000;
  const formatted = displayValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });
  return value < 0 ? `(${formatted})` : formatted;
};

export const formatBalanceDifference = (
  value: number | null | undefined,
  valueMode: ReclassifiedValueMode,
) => {
  if (value === null || value === undefined) return "-";

  let displayValue = Math.abs(value);
  if (valueMode === "MILHAR") displayValue /= 1_000;
  if (valueMode === "MILHARES") displayValue /= 1_000_000;
  const formatted = displayValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  });
  return value < 0 ? `(${formatted})` : formatted;
};

export const getBalanceCheckStatus = (
  value: number | null | undefined,
): BalanceCheckStatus => {
  if (value === null || value === undefined) return "neutral";
  return value === 0 ? "success" : "error";
};
