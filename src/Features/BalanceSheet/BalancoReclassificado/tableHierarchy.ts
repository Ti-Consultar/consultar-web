import {
  Classification,
  Totalizer,
} from "../../../types/balanco";

const mergeClassifications = (
  current: Classification[] = [],
  incoming: Classification[] = [],
): Classification[] => {
  const classifications = new Map<number, Classification>();

  [...current, ...incoming].forEach((classification) => {
    const existing = classifications.get(classification.typeOrder);

    if (!existing) {
      classifications.set(classification.typeOrder, {
        ...classification,
        datas: [...(classification.datas ?? [])],
      });
      return;
    }

    if (
      (existing.datas?.length ?? 0) === 0 &&
      (classification.datas?.length ?? 0) > 0
    ) {
      classifications.set(classification.typeOrder, {
        ...existing,
        datas: [...(classification.datas ?? [])],
      });
    }
  });

  return Array.from(classifications.values()).sort(
    (a, b) => a.typeOrder - b.typeOrder,
  );
};

/**
 * A API pode retornar o mesmo totalizador mais de uma vez com IDs diferentes.
 * `typeOrder` é a identidade estável usada pelo restante das demonstrações.
 * Mantemos os valores da primeira ocorrência e incorporamos apenas detalhes
 * hierárquicos que estejam ausentes nela.
 */
export const mergeTotalizerRows = (rows: Totalizer[]): Totalizer[] => {
  const totalizers = new Map<number, Totalizer>();

  rows.forEach((totalizer) => {
    const existing = totalizers.get(totalizer.typeOrder);

    if (!existing) {
      totalizers.set(totalizer.typeOrder, {
        ...totalizer,
        classifications: mergeClassifications(
          [],
          totalizer.classifications ?? [],
        ),
      });
      return;
    }

    totalizers.set(totalizer.typeOrder, {
      ...existing,
      classifications: mergeClassifications(
        existing.classifications,
        totalizer.classifications,
      ),
    });
  });

  return Array.from(totalizers.values()).sort(
    (a, b) => a.typeOrder - b.typeOrder,
  );
};

export const findTotalizerByOrder = (
  rows: Totalizer[],
  typeOrder: number,
) => rows.find((row) => row.typeOrder === typeOrder);

export const findClassificationByOrder = (
  totalizer: Totalizer | undefined,
  typeOrder: number,
) =>
  totalizer?.classifications?.find(
    (classification) => classification.typeOrder === typeOrder,
  );
