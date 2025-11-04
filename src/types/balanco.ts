// FinancialData stays the same
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

// ✅ NEW — Format of the reclassified API response
export interface BalancoReclassificadoResponse {
  success: boolean;
  data?: {
    realizado: { months: Month[] };
    orcado: { months: Month[] };
    variacao: { months: Month[] };
  };
  message?: string;
}

// ✅ Old format stays for DRE and other screens
export interface BalancoResponse {
  success: boolean;
  data?: {
    months: Month[];
  };
  message?: string;
}
