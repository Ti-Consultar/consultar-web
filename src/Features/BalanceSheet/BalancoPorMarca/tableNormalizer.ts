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

  const groupEntity = entities.find((e) => e.nivel === "Grupo");
  const companyEntities = entities.filter((e) => e.nivel === "Empresa");

  if (!companyEntities.length) {
    return { columns: [], rows: [] };
  }

  // Empresa base para estruturar classifications
  const baseCompanyEntity = companyEntities[0];

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

  // ---------- TOTALIZERS (base podem vir do grupo) ----------
  const baseTotalizers = getMonthTotalizers(
    groupEntity ?? baseCompanyEntity,
  )
    .slice()
    .sort((a, b) => a.typeOrder - b.typeOrder);

  const rows: DreRow[] = [];

  for (const baseTot of baseTotalizers) {
    const isTotalizerPercentage = baseTot.name.trim().endsWith("%");

    // ----- TOTALIZER -----
    const totalizerValues: Record<string, number | null> = {};

    for (const col of columns) {
      const entity =
        col.key === "grupo"
          ? groupEntity
          : companyEntities.find((e) => String(e.companyId) === col.key);

      if (!entity) {
        totalizerValues[col.key] = null;
        continue;
      }

      const found = getMonthTotalizers(entity).find(
        (t) => t.typeOrder === baseTot.typeOrder,
      );

      totalizerValues[col.key] = found?.totalValue ?? null;
    }

    rows.push({
      rowType: "TOTALIZER",
      typeOrder: baseTot.typeOrder,
      name: baseTot.name,
      isPercentage: isTotalizerPercentage,
      values: totalizerValues,
    });

    // ---------- CLASSIFICATIONS (BASE SEMPRE DA EMPRESA) ----------
    const baseCompanyTotalizer = getMonthTotalizers(
      baseCompanyEntity,
    ).find((t) => t.typeOrder === baseTot.typeOrder);

    const baseClassifications =
      baseCompanyTotalizer?.classifications
        ?.slice()
        .sort((a, b) => a.typeOrder - b.typeOrder) ?? [];

    for (const baseCls of baseClassifications) {
      const isClassificationPercentage = baseCls.name
        .trim()
        .endsWith("%");

      const classValues: Record<string, number | null> = {};

      for (const col of columns) {
        const entity =
          col.key === "grupo"
            ? groupEntity
            : companyEntities.find((e) => String(e.companyId) === col.key);

        if (!entity) {
          classValues[col.key] = null;
          continue;
        }

        const tot = getMonthTotalizers(entity).find(
          (t) => t.typeOrder === baseTot.typeOrder,
        );

        const cls = tot?.classifications?.find(
          (c) => c.typeOrder === baseCls.typeOrder,
        );

        classValues[col.key] = cls?.value ?? null;
      }

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

  return { columns, rows };
}
