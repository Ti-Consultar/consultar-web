export type ClassificationType = {
  id: number;
  name: string;
  typeClassification: "ATIVO" | "PASSIVO" | "DRE";
  typeOrder: number;
};

export type CostCenter = {
    costCenter: number;
    name: string;
}

export type Bond = {
  accountPlanClassificationId: number;
  costCenters: CostCenter[];
};

export type BondListWrapper = {
    bondList: Bond[];
}
