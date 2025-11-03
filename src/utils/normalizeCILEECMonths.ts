export function normalizeCILECMonths(monthsFromApi: any[]) {
  return monthsFromApi.map((m) => {
    const realized = { ...(m.realizadoCIL || {}), ...(m.realizadoEC || {}) };
    const orcado = { ...(m.orcadoCIL || {}), ...(m.orcadoEC || {}) };
    const variacao = { ...(m.variacaoCIL || {}), ...(m.variacaoEC || {}) };

    return {
      name: m.name,
      dateMonth: m.dateMonth,
      realizado: realized,
      orcado: orcado,
      variacao: variacao,
    };
  });
}
