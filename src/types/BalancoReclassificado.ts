export interface Classification {
    id: number;
    typeOrder: number;
    name: string;
    value: number;
    datas?: any[];
}

export interface Totalizer {
    id: number;
    typeOrder: number;
    name: string;
    totalValue: number;
    classifications?: Classification[];
}

export interface MonthRaw {
    id: number;
    name: string;
    dateMonth: number;
    monthPainelContabilTotalizer: { name: string; totalValue: number } | null;
    totalizer: Totalizer[];
}

export interface FinancialTableProps {
    realizado: { months: MonthRaw[] };
    orcado: { months: MonthRaw[] };
    variacao: { months: MonthRaw[] };
    showBudgetColumns?: boolean;
    highlightRows?: Record<number, boolean>;
    metricNature?: Record<string, "receita" | "despesa">;
    nestedMode?: "NONE" | "DRE";
}

export type MergedMonth = {
    id: number;
    name: string;
    dateMonth?: number;
    totalReal: number | null;
    totalBudget: number | null;
    totalVar: number | null;
    realRows: Totalizer[];
    budgetRows: Totalizer[];
    varRows: Totalizer[];
};