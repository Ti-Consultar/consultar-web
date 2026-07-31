export type DreV2PeriodType = "month" | "accumulated";

export interface DreV2Period {
  key: string;
  label: string;
  year: number;
  month: number | null;
  type: DreV2PeriodType;
  displayOrder: number;
}

export interface DreV2Scenario {
  key: string;
  label: string;
  displayOrder: number;
}

export type DreV2RowType =
  | "section"
  | "classification"
  | "subtotal"
  | "percentage"
  | "adjustment";

export type DreV2ValueType = "currency" | "percentage";

export interface DreV2RowSource {
  sourceType: "totalizer" | "classification" | "structural";
  totalizerId: number | null;
  classificationId: number | null;
  sourceParentTotalizerId: number | null;
}

export type DreV2PeriodValues = Record<string, number>;
export type DreV2ScenarioValues = Record<string, DreV2PeriodValues>;

export interface DreV2DetailItem {
  id: number;
  name: string;
  costCenter?: string;
  initialValue: number;
  creditValue: number;
  debitValue: number;
  value: number;
}

export type DreV2DetailData = Record<
  string,
  Record<string, DreV2DetailItem[]>
>;

export interface DreV2RowDetails {
  available: boolean;
  counts: Record<string, Record<string, number>>;
  data?: DreV2DetailData;
}

export interface DreV2Row {
  code: string;
  name: string;
  rowType: DreV2RowType;
  valueType: DreV2ValueType;
  displayOrder: number;
  level: number;
  parentCode: string | null;
  expandable: boolean;
  source: DreV2RowSource;
  details: DreV2RowDetails;
  values: DreV2ScenarioValues;
}

export interface DreV2Data {
  periods: DreV2Period[];
  scenarios: DreV2Scenario[];
  rows: DreV2Row[];
}

export interface DreV2Response {
  data: DreV2Data;
}
