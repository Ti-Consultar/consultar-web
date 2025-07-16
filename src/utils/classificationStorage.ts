export type ClassificationBond = {
  accountPlanClassificationId: number;
  costCenters: { costCenter: string }[];
};

export type ClassificationStorage = {
  bondList: ClassificationBond[];
};

const CLASSIFICATION_STORAGE_KEY = "classificationBonds";

export const loadClassificationStorage = (): ClassificationStorage => {
  const raw = localStorage.getItem(CLASSIFICATION_STORAGE_KEY);
  if (!raw) return { bondList: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { bondList: [] };
  }
};

export const saveClassificationStorage = (data: ClassificationStorage) => {
  localStorage.setItem(CLASSIFICATION_STORAGE_KEY, JSON.stringify(data));
};

const removeCostCenterFromAll = (
  costCenter: string,
  storage: ClassificationStorage
): ClassificationStorage => {
  return {
    bondList: storage.bondList
      .map((bond) => ({
        ...bond,
        costCenters: bond.costCenters.filter(
          (c) => c.costCenter !== costCenter
        ),
      }))
      .filter((bond) => bond.costCenters.length > 0),
  };
};

export const addToClassification = (
  accountPlanClassificationId: number,
  costCenters: string[]
) => {
  let current = loadClassificationStorage();

  costCenters.forEach((center) => {
    current = removeCostCenterFromAll(center, current);
  });

  let bond = current.bondList.find(
    (b) => b.accountPlanClassificationId === accountPlanClassificationId
  );

  if (!bond) {
    bond = { accountPlanClassificationId, costCenters: [] };
    current.bondList.push(bond);
  }

  costCenters.forEach((center) => {
    if (!bond!.costCenters.find((c) => c.costCenter === center)) {
      bond!.costCenters.push({ costCenter: center });
    }
  });

  saveClassificationStorage(current);
};

export const getClassificationOfCostCenter = (
  costCenter: string
): number | null => {
  const { bondList } = loadClassificationStorage();
  for (const bond of bondList) {
    if (bond.costCenters.some((c) => c.costCenter === costCenter)) {
      return bond.accountPlanClassificationId;
    }
  }
  return null;
};
