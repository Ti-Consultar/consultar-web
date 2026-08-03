import type { DreV2Row } from "../../../types/dreV2";

export const getDreClassificationExpansionCodes = (
  rows: DreV2Row[],
) => {
  const parentCodes = new Set(
    rows
      .map((row) => row.parentCode)
      .filter((code): code is string => Boolean(code)),
  );

  return rows
    .filter(
      (row) =>
        row.expandable &&
        parentCodes.has(row.code) &&
        row.rowType !== "classification" &&
        row.rowType !== "adjustment",
    )
    .map((row) => row.code);
};

