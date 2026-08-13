type BreadcrumbType = "group" | "company" | "subcompany";
type BreadcrumbItemType = BreadcrumbType | "root" | "section" | "screen";

export type Breadcrumb = {
  id: number;
  type: BreadcrumbType;
};

export type BreadcrumbItem = {
  id?: number;
  link: string;
  name: string;
  parentId?: number;
  type?: BreadcrumbItemType;
};

export type BreadcrumbRouteKey =
  | "groups"
  | "home"
  | "dashboard"
  | "upload-balance-sheet"
  | "balance-column-mapping"
  | "upload-budget-sheet"
  | "upload-account-plan"
  | "balance-sheets"
  | "balance-sheet-data"
  | "balance-sheet-detailed"
  | "balance-assets-liabilities"
  | "classification"
  | "parameters"
  | "accounting-balance"
  | "financial-statements"
  | "brand-statements"
  | "liquidity-management"
  | "economic-indices"
  | "cil-ec"
  | "operational-efficiency"
  | "break-even"
  | "cash-flow"
  | "eva"
  | "profile-info"
  | "profile-security"
  | "profile-customizing"
  | "users";

export type BreadcrumbResolveParams = {
  routeKey: BreadcrumbRouteKey;
  groupId?: string | number;
  companyId?: string | number;
  subCompanyId?: string | number;
  balanceteId?: string | number;
};

export type BreadcrumbResolveResponseItem = {
  label: string;
  path?: string | null;
  routeKey?: BreadcrumbRouteKey | null;
  type?: BreadcrumbItemType;
};
