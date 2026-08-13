export type BreakEvenRowType =
  | "section"
  | "classification"
  | "subtotal"
  | "percentage"
  | "adjustment"
  | string;

export type BreakEvenValueType = "currency" | "percentage";
export type BreakEvenSimulationSignRule = "negative" | "free" | null;

export interface BreakEvenScope {
  groupId: number;
  companyId: number | null;
  subCompanyId: number | null;
}

export interface BreakEvenPeriod {
  year: number;
  month: number;
}

export interface BreakEvenRowSource {
  sourceType: "totalizer" | "classification" | "structural" | string;
  totalizerId: number | null;
  classificationId: number | null;
  sourceParentTotalizerId: number | null;
}

export interface BreakEvenRow {
  code: string;
  name: string;
  rowType: BreakEvenRowType;
  valueType: BreakEvenValueType;
  displayOrder: number;
  level: number;
  parentCode: string | null;
  hasChildren: boolean;
  isTotalizer: boolean;
  canSimulate: boolean;
  simulationPercentage: number | null;
  simulationSignRule: BreakEvenSimulationSignRule;
  behavior: string | null;
  source: BreakEvenRowSource;
  baseValue: number;
  projectedValue: number;
  breakEvenValue: number;
}

export interface BreakEvenSummary {
  projectedGrossOperatingRevenue: number;
  contributionMargin: number;
  contributionMarginPercentage: number;
  fixedResult: number;
  fixedAmountToCover: number;
  baseBreakEven: number;
  finalBreakEven: number;
}

export interface BreakEvenData {
  scope: BreakEvenScope;
  period: BreakEvenPeriod;
  factor: number;
  summary: BreakEvenSummary;
  rows: BreakEvenRow[];
}

export interface BreakEvenResponse {
  data: BreakEvenData;
}

export interface BreakEvenQuery {
  groupId: number;
  companyId?: number;
  subCompanyId?: number;
  year: number;
  month: number;
}

export interface BreakEvenLineSimulation {
  rowCode: string;
  percentage: number;
}

export interface BreakEvenSimulationRequest {
  groupId: number;
  companyId: number | null;
  subCompanyId: number | null;
  year: number;
  month: number;
  factor: number;
  simulations: BreakEvenLineSimulation[];
}

export interface BreakEvenDraft {
  factor: number;
  simulations: Record<string, number>;
}

export type BreakEvenStatus = "clean" | "dirty" | "calculating";
