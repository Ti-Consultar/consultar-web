import type { ColDef } from "ag-grid-community";
import type { TrialBalanceViewerItem } from "../../../types/trialBalanceViewer";
import { formatTrialBalanceAmount } from "./viewer.utils";

const amountColumn = (
  headerName: string,
  field: "previousBalance" | "debit" | "credit" | "finalBalance",
  highlighted = false,
): ColDef<TrialBalanceViewerItem> => ({
  headerName,
  field,
  minWidth: 145,
  width: 155,
  cellClass: highlighted
    ? "trial-balance-number trial-balance-final"
    : "trial-balance-number",
  valueFormatter: ({ value }) => formatTrialBalanceAmount(value),
});

export const TRIAL_BALANCE_COLUMN_DEFS: ColDef<TrialBalanceViewerItem>[] = [
  {
    headerName: "Conta",
    field: "accountCode",
    width: 160,
    minWidth: 140,
  },
  {
    headerName: "Descrição",
    field: "description",
    minWidth: 260,
    flex: 1,
    cellClass: ({ data }) =>
      data?.hasChildren ? "trial-balance-parent-description" : undefined,
    cellStyle: ({ data }) => ({
      paddingLeft: `${12 + Math.max((data?.level ?? 1) - 1, 0) * 18}px`,
    }),
  },
  amountColumn("Saldo anterior", "previousBalance"),
  amountColumn("Débito", "debit"),
  amountColumn("Crédito", "credit"),
  amountColumn("Saldo final", "finalBalance", true),
];
