import * as XLSX from "xlsx";
import type { GroupData } from "../../types/companyDropdown";
import type {
  BreakEvenData,
  BreakEvenDraft,
  BreakEvenRow,
} from "../../types/breakEven";
import type { BreakEvenValueMode } from "./breakEven.utils";
import { sortBreakEvenRows } from "./breakEven.utils.ts";

const MONTH_NAMES_PT_BR = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

const NUMBER_FORMAT = "#,##0.00;\\(#,##0.00\\)";
const PERCENTAGE_FORMAT = "0.00%;(0.00%)";

interface BreakEvenExportOptions {
  data: BreakEvenData;
  draft: BreakEvenDraft;
  entityName: string;
  month: number;
  year: number;
  valueMode: BreakEvenValueMode;
}

const scaleExportValue = (
  value: number,
  valueType: BreakEvenRow["valueType"],
  valueMode: BreakEvenValueMode,
): number => {
  if (valueType === "percentage") return value;
  if (valueMode === "MILHAR") return value / 1_000;
  if (valueMode === "MILHARES") return value / 1_000_000;
  return value;
};

const sanitizeFilePart = (value: string): string =>
  value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .replace(/-+/g, "-") || "Empresa";

export const resolveBreakEvenEntityName = (
  group: GroupData | undefined,
  selectedId: number,
): string => {
  if (!group) return `Empresa-${selectedId}`;
  if (group.id === selectedId) return group.name;

  for (const company of group.filiais) {
    if (company.id === selectedId) return company.name;
    const subCompany = company.subCompanies?.find(
      (item) => item.id === selectedId,
    );
    if (subCompany) return subCompany.name;
  }

  return `Empresa-${selectedId}`;
};

export const buildBreakEvenExportFileName = (
  entityName: string,
  month: number,
  year: number,
): string => {
  const monthName = MONTH_NAMES_PT_BR[month - 1] ?? String(month);
  return `Ponto-equilibrio-${sanitizeFilePart(entityName)}-${monthName}-${year}`;
};

export const buildBreakEvenWorksheet = ({
  data,
  draft,
  valueMode,
}: Pick<BreakEvenExportOptions, "data" | "draft" | "valueMode">): XLSX.WorkSheet => {
  const rows = sortBreakEvenRows(data.rows);
  const worksheetData: (string | number | null)[][] = [
    ["Fator global", draft.factor, null, null],
    [],
    ["DRE", "Simulação", "Projetado", "PE"],
    ...rows.map((row) => [
      `${"   ".repeat(Math.max(row.level, 0))}${row.name}`,
      row.canSimulate ? (draft.simulations[row.code] ?? 0) : null,
      scaleExportValue(row.projectedValue, row.valueType, valueMode),
      scaleExportValue(row.breakEvenValue, row.valueType, valueMode),
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!cols"] = [
    { wch: 48 },
    { wch: 16 },
    { wch: 18 },
    { wch: 18 },
  ];
  worksheet["!autofilter"] = {
    ref: `A3:D${worksheetData.length}`,
  };

  if (worksheet.B1) worksheet.B1.z = PERCENTAGE_FORMAT;

  rows.forEach((row, index) => {
    const excelRow = index + 4;
    const format =
      row.valueType === "percentage" ? PERCENTAGE_FORMAT : NUMBER_FORMAT;
    const simulationCell = worksheet[`B${excelRow}`];
    const projectedCell = worksheet[`C${excelRow}`];
    const breakEvenCell = worksheet[`D${excelRow}`];

    if (simulationCell) simulationCell.z = PERCENTAGE_FORMAT;
    if (projectedCell) projectedCell.z = format;
    if (breakEvenCell) breakEvenCell.z = format;
  });

  return worksheet;
};

export const exportBreakEvenToExcel = (
  options: BreakEvenExportOptions,
): void => {
  const worksheet = buildBreakEvenWorksheet(options);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ponto de Equilíbrio");
  XLSX.writeFile(
    workbook,
    `${buildBreakEvenExportFileName(
      options.entityName,
      options.month,
      options.year,
    )}.xlsx`,
  );
};
