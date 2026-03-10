import {
  DreColumn,
  DreEntity,
  DreRow,
  NormalizedDreTable,
  Totalizer,
} from "../../../types/balancoPorMarca";

export function normalizeDreConsolidatedTable(
  entities: DreEntity[],
): NormalizedDreTable {
  if (!entities.length) {
    return { columns: [], rows: [] };
  }

  const getMonthTotalizers = (e: DreEntity): Totalizer[] =>
    e.painel.months[0]?.totalizer ?? [];

  const companyEntities = entities.filter((e) => e.nivel === "Empresa");
  const groupEntity = entities.find((e) => e.nivel === "Grupo");

  const allEntities = [...companyEntities, ...(groupEntity ? [groupEntity] : [])];

  if (!allEntities.length) {
    return { columns: [], rows: [] };
  }

  // ---------- COLUNAS ----------
  const columns: DreColumn[] = [
    ...companyEntities.map((e) => ({
      key: String(e.companyId),
      label: e.nome,
    })),
  ];

  if (groupEntity) {
    columns.push({
      key: "grupo",
      label: groupEntity.nome,
      isGroup: true,
    });
  }

  const totalizerMap = new Map<number, Totalizer>();

  for (const entity of allEntities) {
    for (const t of getMonthTotalizers(entity)) {
      if (!totalizerMap.has(t.typeOrder)) {
        totalizerMap.set(t.typeOrder, t);
      }
    }
  }

  const baseTotalizers = Array.from(totalizerMap.values()).sort(
    (a, b) => a.typeOrder - b.typeOrder,
  );

  const rows: DreRow[] = [];

  const isRowEmpty = (values: Record<string, number | null>) =>
    Object.values(values).every((v) => v === null || v === 0);

  for (const baseTot of baseTotalizers) {
    const isTotalizerPercentage = baseTot.name.trim().endsWith("%");

    const totalizerValues: Record<string, number | null> = {};

    for (const col of columns) {
      const entity =
        col.key === "grupo"
          ? groupEntity
          : companyEntities.find((e) => String(e.companyId) === col.key);

      const tot = entity
        ? getMonthTotalizers(entity).find(
            (t) => t.typeOrder === baseTot.typeOrder,
          )
        : null;

      totalizerValues[col.key] = tot?.totalValue ?? null;
    }

    if (!isRowEmpty(totalizerValues)) {
      rows.push({
        rowType: "TOTALIZER",
        typeOrder: baseTot.typeOrder,
        name: baseTot.name,
        isPercentage: isTotalizerPercentage,
        values: totalizerValues,
      });
    }

    // ---------- CLASSIFICATIONS (UNIÃO POR NOME) ----------
    const classificationMap = new Map<string, number>();

    for (const entity of allEntities) {
      const tot = getMonthTotalizers(entity).find(
        (t) => t.typeOrder === baseTot.typeOrder,
      );

      for (const cls of tot?.classifications ?? []) {
        if (!classificationMap.has(cls.name)) {
          classificationMap.set(cls.name, cls.typeOrder);
        }
      }
    }

    const baseClassifications = Array.from(classificationMap.entries())
      .map(([name, typeOrder]) => ({ name, typeOrder }))
      .sort((a, b) => a.typeOrder - b.typeOrder);

    for (const baseCls of baseClassifications) {
      const isClassificationPercentage = baseCls.name.trim().endsWith("%");
      const classValues: Record<string, number | null> = {};

      for (const col of columns) {
        const entity =
          col.key === "grupo"
            ? groupEntity
            : companyEntities.find((e) => String(e.companyId) === col.key);

        const tot = entity
          ? getMonthTotalizers(entity).find(
              (t) => t.typeOrder === baseTot.typeOrder,
            )
          : null;

        const cls = tot?.classifications?.find(
          (c) => c.name === baseCls.name,
        );

        classValues[col.key] = cls?.value ?? null;
      }

      if (!isRowEmpty(classValues)) {
        rows.push({
          rowType: "CLASSIFICATION",
          parentTypeOrder: baseTot.typeOrder,
          typeOrder: baseCls.typeOrder,
          name: baseCls.name,
          isPercentage: isClassificationPercentage,
          values: classValues,
        });
      }
    }
  }

  return { columns, rows };
}