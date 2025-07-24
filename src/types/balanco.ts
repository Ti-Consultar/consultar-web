// Type definitions
export interface FinancialData {
  id: number;
  typeOrder: number;
  name: string;
  value: number;
  costCenter?: string;
}

export interface Classification {
  id: number;
  typeOrder: number;
  name: string;
  value: number;
  datas?: FinancialData[];
}

export interface Totalizer {
  id: number;
  typeOrder: number;
  name: string;
  totalValue: number;
  classifications?: Classification[];
}

export interface MonthPainelContabilTotalizer {
  name: string;
  totalValue: number;
}

export interface Month {
  id: number;
  name: string;
  dateMonth: number;
  monthPainelContabilTotalizer: MonthPainelContabilTotalizer;
  totalizer: Totalizer[];
}

export interface BalancoResponse {
  success: boolean;
  data?: {
    months: Month[];
  };
  message?: string;
}
