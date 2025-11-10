export const monthTranslator: Record<string, string> = {
  January: "Janeiro",
  February: "Fevereiro",
  March: "Março",
  April: "Abril",
  May: "Maio",
  June: "Junho",
  July: "Julho",
  August: "Agosto",
  September: "Setembro",
  October: "Outubro",
  November: "Novembro",
  December: "Dezembro",
  Acumulado: "YTD",
  ACUMULADO: "YTD",
};

// Tradutor de mês
export function monthTranslatorUtil(mesIngles: string): string {
  const meses: Record<string, string> = {
    January: "Janeiro",
    February: "Fevereiro",
    March: "Março",
    April: "Abril",
    May: "Maio",
    June: "Junho",
    July: "Julho",
    August: "Agosto",
    September: "Setembro",
    October: "Outubro",
    November: "Novembro",
    December: "Dezembro",
  };
  return meses[mesIngles] || mesIngles;
}
