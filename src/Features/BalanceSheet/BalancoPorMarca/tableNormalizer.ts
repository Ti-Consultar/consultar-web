import { DreColumn, DreEntity, DreRow, NormalizedDreTable, Totalizer } from "../../../types/balancoPorMarca";

export function normalizeDreConsolidatedTable(
    entities: DreEntity[]
): NormalizedDreTable {
    if (!entities.length) {
        return { columns: [], rows: [] };
    }

    // Assume um único mês selecionado (ex: janeiro)
    const getMonthTotalizers = (e: DreEntity): Totalizer[] =>
        e.painel.months[0]?.totalizer ?? [];

    const groupEntity = entities.find((e) => e.nivel === "Grupo");
    const companyEntities = entities.filter((e) => e.nivel === "Empresa");

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

    // ---------- BASE ESTRUTURAL (vem do grupo) ----------
    const baseTotalizers = getMonthTotalizers(groupEntity ?? companyEntities[0])
        .slice()
        .sort((a, b) => a.typeOrder - b.typeOrder);

    const rows: DreRow[] = [];

    for (const baseTot of baseTotalizers) {
        // ----- TOTALIZER -----
        const totalizerValues: Record<string, number | null> = {};

        for (const col of columns) {
            const entity =
                col.key === "grupo"
                    ? groupEntity
                    : companyEntities.find((e) => String(e.companyId) === col.key);

            const found = getMonthTotalizers(entity!).find(
                (t) => t.typeOrder === baseTot.typeOrder
            );

            totalizerValues[col.key] = found?.totalValue ?? null;
        }

        rows.push({
            rowType: "TOTALIZER",
            typeOrder: baseTot.typeOrder,
            name: baseTot.name,
            values: totalizerValues,
        });

        // ----- CLASSIFICATIONS -----
        const baseClassifications =
            baseTot.classifications?.slice().sort(
                (a, b) => a.typeOrder - b.typeOrder
            ) ?? [];

        for (const baseCls of baseClassifications) {
            const classValues: Record<string, number | null> = {};

            for (const col of columns) {
                const entity =
                    col.key === "grupo"
                        ? groupEntity
                        : companyEntities.find((e) => String(e.companyId) === col.key);

                const tot = getMonthTotalizers(entity!).find(
                    (t) => t.typeOrder === baseTot.typeOrder
                );

                const cls = tot?.classifications?.find(
                    (c) => c.typeOrder === baseCls.typeOrder
                );

                classValues[col.key] = cls?.value ?? null;
            }

            rows.push({
                rowType: "CLASSIFICATION",
                parentTypeOrder: baseTot.typeOrder,
                typeOrder: baseCls.typeOrder,
                name: baseCls.name,
                values: classValues,
            });
        }
    }

    return { columns, rows };
}
