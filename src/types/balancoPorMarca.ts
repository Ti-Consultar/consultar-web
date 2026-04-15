export type DreEntity = {
  nivel: "Empresa" | "Grupo";
  companyId: number | null;
  nome: string;
  painel: {
    months: Array<{
      totalizer: Totalizer[];
    }>;
  };
};

export type Totalizer = {
  id: number;
  typeOrder: number;
  name: string;
  totalValue: number | null;
  classifications?: Classification[];
};

export type Classification = {
  id: number;
  typeOrder: number;
  name: string;
  value: number | null;
};

export type DreColumn = {
  key: string;
  label: string;
  isGroup?: boolean;
  isHighlighted?: boolean;
};

export type DreRow =
  | {
      rowType: "TOTALIZER";
      typeOrder: number;
      name: string;
      isPercentage?: boolean;
      values: Record<string, number | null>;
    }
  | {
      rowType: "CLASSIFICATION";
      parentTypeOrder: number;
      typeOrder: number;
      name: string;
      isPercentage?: boolean;
      values: Record<string, number | null>;
    };

export type NormalizedDreTable = {
  columns: DreColumn[];
  rows: DreRow[];
};
