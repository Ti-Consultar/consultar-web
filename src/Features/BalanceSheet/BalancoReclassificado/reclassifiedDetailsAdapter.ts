import type {
  ReclassifiedClassificationData,
  ReclassifiedDetailsData,
  ReclassifiedScenarioKey,
} from "../../../types/reclassifiedBalanceSheetV2";

export type ReclassifiedDetailKind =
  | "totalizer"
  | "classification"
  | "data";

export interface ReclassifiedDetailRow {
  key: string;
  name: string;
  kind: ReclassifiedDetailKind;
  expandable: boolean;
  costCenter?: string;
  values: Partial<
    Record<ReclassifiedScenarioKey, Partial<Record<string, number>>>
  >;
  children: ReclassifiedDetailRow[];
}

const scenarioKeys: ReclassifiedScenarioKey[] = [
  "realizado",
  "orcado",
  "variacao",
];

const setValue = (
  row: ReclassifiedDetailRow,
  scenarioKey: ReclassifiedScenarioKey,
  periodKey: string,
  value: number,
) => {
  const scenarioValues = row.values[scenarioKey] ?? {};
  scenarioValues[periodKey] = value;
  row.values[scenarioKey] = scenarioValues;
};

const getOrCreateRow = (
  rows: Map<string, ReclassifiedDetailRow>,
  key: string,
  name: string,
  kind: ReclassifiedDetailKind,
  expandable: boolean,
  costCenter?: string,
) => {
  const current = rows.get(key);
  if (current) {
    current.expandable ||= expandable;
    return current;
  }

  const created: ReclassifiedDetailRow = {
    key,
    name,
    kind,
    expandable,
    costCenter,
    values: {},
    children: [],
  };
  rows.set(key, created);
  return created;
};

const entityKey = (
  entity: Pick<
    ReclassifiedClassificationData,
    "id" | "typeOrder" | "name" | "costCenter"
  >,
) => {
  const normalizedName = entity.name.trim().toLocaleLowerCase("pt-BR");
  if (entity.typeOrder !== undefined) {
    return `order:${entity.typeOrder}:${entity.costCenter ?? ""}`;
  }
  return `name:${normalizedName}:${entity.costCenter ?? ""}`;
};

export const buildReclassifiedDetailRows = (
  data: ReclassifiedDetailsData | undefined,
): ReclassifiedDetailRow[] => {
  if (!data) return [];

  const totalizerRows = new Map<string, ReclassifiedDetailRow>();
  const directDetailRows = new Map<string, ReclassifiedDetailRow>();
  const classificationRowsByTotalizer = new Map<
    string,
    Map<string, ReclassifiedDetailRow>
  >();
  const dataRowsByClassification = new Map<
    string,
    Map<string, ReclassifiedDetailRow>
  >();

  scenarioKeys.forEach((scenarioKey) => {
    Object.entries(data[scenarioKey] ?? {}).forEach(
      ([periodKey, details]) => {
        (details ?? []).forEach((detail) => {
          if (!("totalValue" in detail)) {
            const detailKey = entityKey(detail);
            const detailRow = getOrCreateRow(
              directDetailRows,
              detailKey,
              detail.name,
              "data",
              false,
              detail.costCenter,
            );
            setValue(detailRow, scenarioKey, periodKey, detail.value);
            return;
          }

          const totalizer = detail;
          const totalizerKey = entityKey(totalizer);
          const totalizerRow = getOrCreateRow(
            totalizerRows,
            totalizerKey,
            totalizer.name,
            "totalizer",
            totalizer.expandable ||
              (totalizer.classifications?.length ?? 0) > 0,
          );
          setValue(
            totalizerRow,
            scenarioKey,
            periodKey,
            totalizer.totalValue,
          );

          const classificationRows =
            classificationRowsByTotalizer.get(totalizerKey) ??
            new Map<string, ReclassifiedDetailRow>();
          (totalizer.classifications ?? []).forEach(
            (classification) => {
              const classificationKey = `${totalizerKey}:${entityKey(
                classification,
              )}`;
              const classificationData =
                classification.datas ?? classification.data ?? [];
              const classificationRow = getOrCreateRow(
                classificationRows,
                classificationKey,
                classification.name,
                "classification",
                classificationData.length > 0,
                classification.costCenter,
              );
              setValue(
                classificationRow,
                scenarioKey,
                periodKey,
                classification.value,
              );

              const dataRows =
                dataRowsByClassification.get(classificationKey) ??
                new Map<string, ReclassifiedDetailRow>();
              classificationData.forEach((detail) => {
                const key = `${classificationKey}:${entityKey(
                  detail,
                )}`;
                const dataRow = getOrCreateRow(
                  dataRows,
                  key,
                  detail.name,
                  "data",
                  false,
                  detail.costCenter,
                );
                setValue(dataRow, scenarioKey, periodKey, detail.value);
              });
              dataRowsByClassification.set(classificationKey, dataRows);
            },
          );
          classificationRowsByTotalizer.set(totalizerKey, classificationRows);
        });
      },
    );
  });

  classificationRowsByTotalizer.forEach((classificationRows) => {
    classificationRows.forEach((classificationRow) => {
      classificationRow.children = Array.from(
        dataRowsByClassification.get(classificationRow.key)?.values() ?? [],
      );
    });
  });

  totalizerRows.forEach((totalizerRow) => {
    totalizerRow.children = Array.from(
      classificationRowsByTotalizer.get(totalizerRow.key)?.values() ?? [],
    );
  });

  return [
    ...Array.from(totalizerRows.values()),
    ...Array.from(directDetailRows.values()),
  ];
};
