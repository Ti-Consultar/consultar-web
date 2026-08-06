export const TRIAL_BALANCE_VIEWER_BLOCK_SIZE = 200;

export const TRIAL_BALANCE_SORT_FIELDS = [
  "id",
  "sourceOrder",
  "accountCode",
  "description",
  "level",
  "previousBalance",
  "debit",
  "credit",
  "finalBalance",
] as const;

export type TrialBalanceSortField =
  (typeof TRIAL_BALANCE_SORT_FIELDS)[number];

export type TrialBalanceSortDirection = "asc" | "desc";

export type TrialBalanceViewerItem = {
  id: number;
  sourceOrder: number;
  accountCode: string;
  description: string;
  level: number;
  hasChildren: boolean;
  previousBalance: number;
  debit: number;
  credit: number;
  finalBalance: number;
};

export type TrialBalanceViewerPagination = {
  offset: number;
  limit: number;
  returned: number;
  total: number;
  hasMore: boolean;
};

export type TrialBalanceViewerResponse = {
  trialBalanceId: number;
  items: TrialBalanceViewerItem[];
  pagination: TrialBalanceViewerPagination;
};

export type TrialBalanceViewerFilters = {
  search: string;
  levels: number[];
  onlyWithMovement: boolean;
};

export type TrialBalanceViewerQuery = {
  offset: number;
  limit: number;
  sort: TrialBalanceSortField;
  direction: TrialBalanceSortDirection;
  search?: string;
  levels?: string;
  onlyWithMovement: boolean;
};

export type TrialBalanceViewerMetadata = {
  reference?: string;
  company?: string;
  branch?: string;
  fileName?: string;
};

export type TrialBalanceViewerLocationState = {
  trialBalance?: TrialBalanceViewerMetadata;
};
