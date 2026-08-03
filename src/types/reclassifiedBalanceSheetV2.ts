export type ReclassifiedPeriodType = "month" | "accumulated";

export type ReclassifiedScenarioKey =
  | "realizado"
  | "orcado"
  | "variacao";

export type ReclassifiedStatementKey = "asset" | "liability";

export type ReclassifiedRowType = "section" | "total" | "validation";

export interface ReclassifiedPeriod {
  key: string;
  label: string;
  year: number;
  month: number | null;
  type: ReclassifiedPeriodType;
  displayOrder: number;
}

export interface ReclassifiedScenario {
  key: ReclassifiedScenarioKey;
  label: string;
  displayOrder: number;
}

export interface ReclassifiedStatement {
  key: ReclassifiedStatementKey;
  label: string;
  displayOrder: number;
  totalRowCode: string;
}

export interface ReclassifiedRowSource {
  sourceType: "legacyGroup" | "legacyTotalizer" | "calculated";
  sourceId: number | null;
}

export type ReclassifiedPeriodValues = Partial<Record<string, number>>;
export type ReclassifiedScenarioValues = Partial<
  Record<ReclassifiedScenarioKey, ReclassifiedPeriodValues>
>;

export interface ReclassifiedClassificationData {
  id: number;
  typeOrder?: number;
  name: string;
  value: number;
  costCenter?: string;
}

export interface ReclassifiedClassificationDetail {
  id: number;
  typeOrder?: number;
  name: string;
  value: number;
  costCenter?: string;
  datas?: ReclassifiedClassificationData[];
  data?: ReclassifiedClassificationData[];
}

export interface ReclassifiedComponentTotalizer {
  id: number;
  typeOrder?: number;
  name: string;
  totalValue: number;
  expandable: boolean;
  classifications: ReclassifiedClassificationDetail[];
}

export type ReclassifiedDetailsData = Partial<
  Record<
    ReclassifiedScenarioKey,
    Partial<Record<string, ReclassifiedComponentTotalizer[]>>
  >
>;

export interface ReclassifiedRowDetails {
  available: boolean;
  counts: Partial<
    Record<ReclassifiedScenarioKey, Partial<Record<string, number>>>
  >;
  data?: ReclassifiedDetailsData;
}

export interface ReclassifiedBalanceSheetRow {
  code: string;
  statementKey: ReclassifiedStatementKey;
  name: string;
  rowType: ReclassifiedRowType;
  valueType?: "currency";
  displayOrder: number;
  level?: number;
  parentCode?: string | null;
  expandable: boolean;
  source: ReclassifiedRowSource;
  details?: ReclassifiedRowDetails;
  values: ReclassifiedScenarioValues;
}

export interface ReclassifiedBalanceSheetData {
  periods: ReclassifiedPeriod[];
  scenarios: ReclassifiedScenario[];
  statements: ReclassifiedStatement[];
  rows: ReclassifiedBalanceSheetRow[];
}

export interface ReclassifiedBalanceSheetResponse {
  data: ReclassifiedBalanceSheetData;
}

export interface ReclassifiedBalanceSheetParams {
  accountPlanId: number;
  year: number;
  groupId?: number;
  companyId?: number;
  subCompanyId?: number;
}
