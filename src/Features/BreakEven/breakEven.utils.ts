import type {
  BreakEvenData,
  BreakEvenDraft,
  BreakEvenRow,
  BreakEvenSimulationSignRule,
} from "../../types/breakEven";

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const humanPercentageFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export type BreakEvenValueMode = "TOTAL" | "MILHAR" | "MILHARES";

const scaleBreakEvenNumber = (
  value: number,
  valueMode: BreakEvenValueMode,
): number => {
  if (valueMode === "MILHAR") return value / 1_000;
  if (valueMode === "MILHARES") return value / 1_000_000;
  return value;
};

export const formatBreakEvenNumber = (
  value: number,
  valueMode: BreakEvenValueMode = "TOTAL",
): string => {
  if (!Number.isFinite(value)) return "—";
  const scaledValue = scaleBreakEvenNumber(value, valueMode);
  const absolute = numberFormatter.format(Math.abs(scaledValue));
  return scaledValue < 0 ? `(${absolute})` : absolute;
};

export const formatBreakEvenPercentage = (value: number): string =>
  Number.isFinite(value) ? percentageFormatter.format(value) : "—";

export const formatBreakEvenValue = (
  value: number,
  valueType: BreakEvenRow["valueType"],
  valueMode: BreakEvenValueMode = "TOTAL",
): string =>
  valueType === "percentage"
    ? formatBreakEvenPercentage(value)
    : formatBreakEvenNumber(value, valueMode);

export const formatHumanPercentage = (decimalValue: number): string =>
  humanPercentageFormatter.format(decimalValue * 100);

export const applySimulationSignRule = (
  value: number,
  rule: BreakEvenSimulationSignRule,
): number => (rule === "negative" ? -Math.abs(value) : value);

export const parseHumanPercentage = (rawValue: string): number | null => {
  const compact = rawValue.trim().replace(/\s|%/g, "");
  const commaIndex = compact.lastIndexOf(",");
  const dotIndex = compact.lastIndexOf(".");
  let normalized = compact;

  if (commaIndex >= 0 && dotIndex >= 0) {
    const decimalSeparator = commaIndex > dotIndex ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    normalized = compact
      .split(thousandsSeparator)
      .join("")
      .replace(decimalSeparator, ".");
  } else if (commaIndex >= 0) {
    normalized = compact.replace(",", ".");
  }

  if (!normalized || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
    return null;
  }

  const humanValue = Number(normalized);
  if (!Number.isFinite(humanValue) || humanValue < -100) return null;
  return humanValue / 100;
};

export const createBreakEvenDraft = (data: BreakEvenData): BreakEvenDraft => ({
  factor: data.factor ?? 0,
  simulations: Object.fromEntries(
    data.rows
      .filter((row) => row.canSimulate)
      .map((row) => [row.code, row.simulationPercentage ?? 0]),
  ),
});

export const isBreakEvenDraftModified = (
  data: BreakEvenData,
  draft: BreakEvenDraft,
): boolean => {
  if (Math.abs((data.factor ?? 0) - draft.factor) > Number.EPSILON) return true;

  return data.rows.some(
    (row) =>
      row.canSimulate &&
      Math.abs(
        (row.simulationPercentage ?? 0) - (draft.simulations[row.code] ?? 0),
      ) > Number.EPSILON,
  );
};

export const sortBreakEvenRows = (rows: BreakEvenRow[]): BreakEvenRow[] =>
  [...rows].sort(
    (left, right) =>
      left.displayOrder - right.displayOrder || left.code.localeCompare(right.code),
  );
