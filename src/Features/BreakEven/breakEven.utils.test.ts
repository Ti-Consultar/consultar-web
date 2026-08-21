import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import type { BreakEvenData, BreakEvenRow } from "../../types/breakEven";
import {
  applySimulationSignRule,
  createBreakEvenDraft,
  formatBreakEvenNumber,
  formatBreakEvenPercentage,
  isBreakEvenDraftModified,
  parseHumanPercentage,
  sortBreakEvenRows,
} from "./breakEven.utils.ts";
import {
  buildBreakEvenExportFileName,
  buildBreakEvenWorksheet,
  resolveBreakEvenEntityName,
} from "./breakEven.export.ts";
import type { GroupData } from "../../types/companyDropdown.ts";

test("converte o percentual humano para a escala decimal da API", () => {
  assert.equal(parseHumanPercentage("10"), 0.1);
  assert.equal(parseHumanPercentage("-5"), -0.05);
  assert.equal(parseHumanPercentage("35,5"), 0.355);
  assert.equal(parseHumanPercentage("35.5"), 0.355);
  assert.equal(parseHumanPercentage("-100"), -1);
});

test("rejeita percentual abaixo de -100 e entradas incompletas", () => {
  assert.equal(parseHumanPercentage("-105"), null);
  assert.equal(parseHumanPercentage("-"), null);
  assert.equal(parseHumanPercentage("abc"), null);
  assert.equal(parseHumanPercentage(""), null);
});

test("aplica a regra de sinal informada pelo backend", () => {
  assert.equal(applySimulationSignRule(0.1, "negative"), -0.1);
  assert.equal(applySimulationSignRule(-0.1, "negative"), -0.1);
  assert.equal(applySimulationSignRule(0, "negative"), -0);
  assert.equal(applySimulationSignRule(0.1, "free"), 0.1);
  assert.equal(applySimulationSignRule(-0.1, "free"), -0.1);
  assert.equal(applySimulationSignRule(0.1, null), 0.1);
});

test("formata números sem sinal de moeda e percentual na escala correta", () => {
  assert.equal(formatBreakEvenNumber(1002904.36), "1.002.904,36");
  assert.equal(formatBreakEvenNumber(-69355.97), "(69.355,97)");
  assert.equal(formatBreakEvenNumber(1002904.36, "MILHAR"), "1.002,90");
  assert.equal(formatBreakEvenNumber(1002904.36, "MILHARES"), "1,00");
  assert.equal(formatBreakEvenNumber(-69355.97, "MILHAR"), "(69,36)");
  assert.equal(formatBreakEvenPercentage(0.399546), "39,95%");
});

test("cria draft somente com linhas simuláveis e mantém valores da API", () => {
  const rows = [
    {
      code: "SIM",
      canSimulate: true,
      simulationPercentage: -0.1,
    },
    {
      code: "LOCKED",
      canSimulate: false,
      simulationPercentage: null,
    },
  ] as BreakEvenRow[];
  const data = { factor: 0.05, rows } as BreakEvenData;

  assert.deepEqual(createBreakEvenDraft(data), {
    factor: 0.05,
    simulations: { SIM: -0.1 },
  });
  assert.equal(
    isBreakEvenDraftModified(data, {
      factor: 0.05,
      simulations: { SIM: -0.1 },
    }),
    false,
  );
  assert.equal(
    isBreakEvenDraftModified(data, {
      factor: 0.05,
      simulations: { SIM: 0.1 },
    }),
    true,
  );
});

test("ordena linhas exclusivamente pelos metadados de exibição", () => {
  const rows = [
    { code: "B", displayOrder: 2 },
    { code: "C", displayOrder: 1 },
    { code: "A", displayOrder: 1 },
  ] as BreakEvenRow[];

  assert.deepEqual(sortBreakEvenRows(rows).map((row) => row.code), ["A", "C", "B"]);
});

test("monta a planilha do PE com fator, cabeçalhos e formatos numéricos", () => {
  const data = {
    factor: 0.05,
    rows: [
      {
        code: "REVENUE",
        name: "Receita Operacional",
        displayOrder: 1,
        level: 0,
        canSimulate: true,
        simulationPercentage: 0.1,
        valueType: "currency",
        projectedValue: 1_250_000,
        breakEvenValue: -950_000,
      },
      {
        code: "MARGIN",
        name: "Margem",
        displayOrder: 2,
        level: 1,
        canSimulate: false,
        simulationPercentage: null,
        valueType: "percentage",
        projectedValue: 0.4,
        breakEvenValue: 0.35,
      },
    ],
  } as BreakEvenData;

  const worksheet = buildBreakEvenWorksheet({
    data,
    draft: { factor: 0.08, simulations: { REVENUE: 0.12 } },
    valueMode: "MILHAR",
  });

  assert.equal(worksheet.A1.v, "Fator global");
  assert.equal(worksheet.B1.v, 0.08);
  assert.equal(worksheet.B1.z, "0.00%;(0.00%)");
  assert.deepEqual(
    [worksheet.A3.v, worksheet.B3.v, worksheet.C3.v, worksheet.D3.v],
    ["DRE", "Simulação", "Projetado", "PE"],
  );
  assert.equal(worksheet.B4.v, 0.12);
  assert.equal(worksheet.C4.v, 1250);
  assert.equal(worksheet.D4.v, -950);
  assert.equal(worksheet.D4.z, "#,##0.00;\\(#,##0.00\\)");
  assert.equal(XLSX.utils.format_cell(worksheet.D4), "(950.00)");
  assert.equal(worksheet.B5, undefined);
  assert.equal(worksheet.C5.v, 0.4);
  assert.equal(worksheet.C5.z, "0.00%;(0.00%)");
});

test("resolve a empresa e gera o nome do arquivo no padrão solicitado", () => {
  const group = {
    id: 10,
    name: "Grupo Principal",
    filiais: [
      {
        id: 20,
        name: "Empresa / SP",
        subCompanies: [{ id: 30, name: "Unidade Sul" }],
      },
    ],
  } as GroupData;

  assert.equal(resolveBreakEvenEntityName(group, 30), "Unidade Sul");
  assert.equal(
    buildBreakEvenExportFileName("Empresa / SP", 8, 2026),
    "Ponto-equilibrio-Empresa-SP-Agosto-2026",
  );
});
