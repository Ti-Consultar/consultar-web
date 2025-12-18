import {
  SpreadsheetData,
  SpreadsheetRow,
} from "../../Features/Upload/BalanceColumnMapping/SpreadsheetTable";
import * as XLSX from "xlsx";

export function parseSheet(sheet: XLSX.WorkSheet): SpreadsheetData {
  const range = XLSX.utils.decode_range(sheet["!ref"] as string);

  const columns: string[] = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    columns.push(XLSX.utils.encode_col(c));
  }

  const rows: SpreadsheetRow[] = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: SpreadsheetRow = [];

    for (let c = range.s.c; c <= range.e.c; c++) {
      const address = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[address];

      row.push({
        value: cell ? cell.v ?? "" : "",
      });
    }

    rows.push(row);
  }

  applyMerges(sheet, rows);

  return { columns, rows };
}

function applyMerges(sheet: XLSX.WorkSheet, rows: SpreadsheetRow[]) {
  const merges = sheet["!merges"] ?? [];

  merges.forEach((merge) => {
    const { s, e } = merge;

    const masterCell = rows[s.r][s.c];
    masterCell.rowSpan = e.r - s.r + 1;
    masterCell.colSpan = e.c - s.c + 1;

    for (let r = s.r; r <= e.r; r++) {
      for (let c = s.c; c <= e.c; c++) {
        if (r === s.r && c === s.c) continue;
        rows[r][c].value = null;
      }
    }
  });
}
