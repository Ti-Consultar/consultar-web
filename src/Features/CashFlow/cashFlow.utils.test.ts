import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import type { CashFlowAnnual, CashFlowMonth } from "./table";
import { buildCashFlowExportData } from "./cashFlow.utils.ts";

const metric = "fluxoDeCaixaOperacional";
const month = (dateMonth: number, name: string, value: number | null): CashFlowMonth => ({
  dateMonth,
  name,
  [metric]: value,
});
const defaults = {
  realizado: [] as CashFlowMonth[],
  orcado: [] as CashFlowMonth[],
  variacao: [] as CashFlowMonth[],
  annual: null as CashFlowAnnual | null,
  metricKeys: [metric],
  metricLabels: { [metric]: "Fluxo de Caixa Operacional" },
};

const annual: CashFlowAnnual = {
  year: 2026,
  type: "rolling",
  displayOrder: 14,
  columns: [
    { key: "variacao", label: "Variação", displayOrder: 3, value: { cashFlow: { [metric]: -25.75 } } },
    { key: "orcado", label: "Orçado", displayOrder: 1, value: { [metric]: 1000.5 } },
    { key: "rolling", label: "Rolling", displayOrder: 2, value: { cashFlow: { [metric]: 974.75 } } },
  ],
};

const matrix = (options: Parameters<typeof buildCashFlowExportData>[0]) => {
  const { columns, rows } = buildCashFlowExportData(options);
  return [
    columns.map((column) => column.label),
    ...rows.map((row) => columns.map((column) => column.accessor(row))),
  ];
};

test("exporta comparação mensal, YTD e todas as colunas anuais com números no Excel", () => {
  const data = matrix({
    ...defaults,
    realizado: [month(13, "ACUMULADO", 120.25), month(1, "January", 120.25)],
    orcado: [month(1, "Janeiro", 100), month(13, "Acumulado", 100)],
    variacao: [month(13, "YTD", 20.25), month(1, "January", 20.25)],
    annual,
  });
  assert.deepEqual(data, [
    ["Conta", "Janeiro - Orçado", "Janeiro - Realizado", "Janeiro - Variação",
      "YTD - Orçado", "YTD - Realizado", "YTD - Variação",
      "2026 - Orçado", "2026 - Rolling", "2026 - Variação"],
    ["Fluxo de Caixa Operacional", 100, 120.25, 20.25, 100, 120.25, 20.25, 1000.5, 974.75, -25.75],
  ]);

  // Exercise the same XLSX serialization used by exportExcel and reopen it.
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(data), "Dados");
  const reopened = XLSX.read(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
  const worksheet = reopened.Sheets.Dados;
  assert.deepEqual(XLSX.utils.sheet_to_json(worksheet, { header: 1 }), data);
  assert.equal(worksheet.I2.t, "n");
  assert.equal(worksheet.J2.v, -25.75);
  assert.deepEqual(annual.columns.map((column) => column.key), ["variacao", "orcado", "rolling"]);
});

test("inclui meses exclusivos de Orçado e distingue valores ausentes de zero", () => {
  assert.deepEqual(matrix({
    ...defaults,
    realizado: [month(2, "February", 0)],
    orcado: [month(3, "March", 300), month(2, "February", null)],
    variacao: [month(1, "January", -5)],
  }), [
    ["Conta", "Janeiro - Orçado", "Janeiro - Realizado", "Janeiro - Variação",
      "Fevereiro - Orçado", "Fevereiro - Realizado", "Fevereiro - Variação",
      "Março - Orçado", "Março - Realizado", "Março - Variação"],
    ["Fluxo de Caixa Operacional", "-", "-", -5, "-", 0, "-", 300, "-", "-"],
  ]);
});

test("permite exportar quando há apenas Orçado ou apenas Rolling", () => {
  assert.deepEqual(matrix({ ...defaults, orcado: [month(1, "January", 100)] })[1],
    ["Fluxo de Caixa Operacional", 100, "-", "-"]);
  assert.deepEqual(matrix({ ...defaults, annual })[1],
    ["Fluxo de Caixa Operacional", 1000.5, 974.75, -25.75]);
});

test("mantém os saldos YTD recebidos e a ordem das contas sem somar saldos mensais", () => {
  const opening = "disponibilidadeInicioDoPeriodo";
  const closing = "disponibilidadeFinalDoPeriodo";
  const data = matrix({
    ...defaults,
    metricKeys: [opening, closing],
    metricLabels: { [opening]: "Saldo inicial", [closing]: "Saldo final" },
    realizado: [
      { name: "January", dateMonth: 1, [opening]: 50, [closing]: 100 },
      { name: "February", dateMonth: 2, [opening]: 100, [closing]: 175 },
      { name: "Acumulado", dateMonth: 13, [opening]: 50, [closing]: 175 },
    ],
  });
  assert.equal(data[1][0], "Saldo inicial");
  assert.equal(data[1][8], 50);
  assert.equal(data[2][0], "Saldo final");
  assert.equal(data[2][8], 175);
});

test("preserva zero anual e representa dados anuais ausentes como hífen", () => {
  assert.deepEqual(matrix({
    ...defaults,
    annual: {
      ...annual,
      columns: [
        { key: "orcado", label: "Orçado", displayOrder: 1, value: { [metric]: 0 } },
        { key: "rolling", label: "Rolling", displayOrder: 2, value: { cashFlow: { [metric]: 0 } } },
        { key: "variacao", label: "Variação", displayOrder: 3, value: null },
      ],
    },
  })[1], ["Fluxo de Caixa Operacional", 0, 0, "-"]);
});

test("retorna exportação vazia quando não há períodos disponíveis", () => {
  assert.deepEqual(buildCashFlowExportData(defaults), { columns: [], rows: [] });
});
