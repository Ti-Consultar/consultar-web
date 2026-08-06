import type { SortModelItem } from "ag-grid-community";
import type { Balancete } from "../../../types/balancete";
import {
  TRIAL_BALANCE_SORT_FIELDS,
  TRIAL_BALANCE_VIEWER_BLOCK_SIZE,
} from "../../../types/trialBalanceViewer.ts";
import type {
  TrialBalanceSortDirection,
  TrialBalanceSortField,
  TrialBalanceViewerFilters,
  TrialBalanceViewerLocationState,
  TrialBalanceViewerQuery,
} from "../../../types/trialBalanceViewer.ts";

export const SEARCH_DEBOUNCE_MS = 350;
export const DEFAULT_VIEWER_SORT: Readonly<{
  field: TrialBalanceSortField;
  direction: TrialBalanceSortDirection;
}> = { field: "sourceOrder", direction: "asc" };

const sortableFields = new Set<string>(TRIAL_BALANCE_SORT_FIELDS);

export const getRemoteSort = (sortModel: SortModelItem[] = []) => {
  const selectedSort = sortModel[0];

  if (
    !selectedSort?.colId ||
    !sortableFields.has(selectedSort.colId) ||
    (selectedSort.sort !== "asc" && selectedSort.sort !== "desc")
  ) {
    return DEFAULT_VIEWER_SORT;
  }

  return {
    field: selectedSort.colId as TrialBalanceSortField,
    direction: selectedSort.sort,
  };
};

export const buildViewerQuery = (
  startRow: number,
  endRow: number,
  filters: TrialBalanceViewerFilters,
  sortModel: SortModelItem[] = [],
): TrialBalanceViewerQuery => {
  const sort = getRemoteSort(sortModel);
  const search = filters.search.trim();

  return {
    offset: startRow,
    limit: Math.min(
      Math.max(endRow - startRow, 1),
      TRIAL_BALANCE_VIEWER_BLOCK_SIZE,
    ),
    sort: sort.field,
    direction: sort.direction,
    onlyWithMovement: filters.onlyWithMovement,
    ...(search ? { search } : {}),
    ...(filters.levels.length
      ? { levels: [...filters.levels].sort((a, b) => a - b).join(",") }
      : {}),
  };
};

const amountFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatTrialBalanceAmount = (value: number | null | undefined) =>
  amountFormatter.format(value ?? 0);

const months: Record<string, string> = {
  "1": "Janeiro",
  "2": "Fevereiro",
  "3": "Março",
  "4": "Abril",
  "5": "Maio",
  "6": "Junho",
  "7": "Julho",
  "8": "Agosto",
  "9": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
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

export const formatTrialBalanceReference = (
  month: string | number,
  year: number,
) => `${months[String(month)] ?? month} de ${year}`;

export const buildTrialBalanceViewerPath = (
  pathname: string,
  trialBalanceId: number,
) => {
  const basePath = pathname
    .replace(/\/arquivos\/upload\/balancete\/?$/, "")
    .replace(/\/balancetes\/?$/, "");
  return `${basePath}/balancetes/${trialBalanceId}`;
};

export const getTrialBalanceListPath = (pathname: string) =>
  pathname.replace(/\/balancetes\/[^/]+\/?$/, "/balancetes");

export const buildTrialBalanceLocationState = (
  trialBalance: Balancete,
): TrialBalanceViewerLocationState => ({
  trialBalance: {
    reference: formatTrialBalanceReference(
      trialBalance.dateMonth,
      trialBalance.dateYear,
    ),
    company: trialBalance.accountPlan?.company?.name,
    branch: trialBalance.accountPlan?.subCompany?.name,
  },
});

export type ViewerErrorKind = "not-found" | "generic";

export const getViewerErrorKind = (error: unknown): ViewerErrorKind => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    error.response.status === 404
  ) {
    return "not-found";
  }

  return "generic";
};

export const scheduleDebouncedSearch = (
  callback: (value: string) => void,
  value: string,
  delay = SEARCH_DEBOUNCE_MS,
) => {
  const timeoutId = setTimeout(() => callback(value), delay);
  return () => clearTimeout(timeoutId);
};

export const normalizeHierarchyLevels = (levels: number[]) => {
  const highestLevel = Math.max(
    0,
    ...levels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 5),
  );

  return Array.from({ length: highestLevel }, (_, index) => index + 1);
};
