export type ClassificationRow = {
  id: number;
  classifications?: Array<{
    id: number;
    datas?: Array<{ name: string; value: number; costCenter?: string }>;
  }>;
};

export const hasAnyDatas = <Month>(
  months: Month[],
  totId: number,
  clsId: number,
  getRows: (month: Month) => ClassificationRow[],
) => {
  return months.some((month) => {
    const row = getRows(month).find((x) => x.id === totId);
    const cls = row?.classifications?.find((x) => x.id === clsId);
    return !!cls?.datas?.length;
  });
};

export const getUniqueDataNames = <Month>(
  months: Month[],
  totId: number,
  clsId: number,
  getRows: (month: Month) => ClassificationRow[],
): Array<{ name: string; costCenter?: string }> => {
  const seen = new Map<string, { name: string; costCenter?: string }>();
  months.forEach((month) => {
    const cls = getRows(month)
      .find((x) => x.id === totId)
      ?.classifications?.find((x) => x.id === clsId);
    cls?.datas?.forEach((data) => {
      if (!seen.has(data.name)) {
        seen.set(data.name, {
          name: data.name,
          costCenter: data.costCenter,
        });
      }
    });
  });
  return Array.from(seen.values());
};

export const getDataValueByNameForMonth = <Month>(
  month: Month,
  totId: number,
  clsId: number,
  dataName: string,
  getRows: (month: Month) => ClassificationRow[],
): number | undefined => {
  const cls = getRows(month)
    .find((x) => x.id === totId)
    ?.classifications?.find((x) => x.id === clsId);
  return cls?.datas?.find((d) => d.name === dataName)?.value;
};
