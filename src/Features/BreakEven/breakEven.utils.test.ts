import assert from "node:assert/strict";
import test from "node:test";
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
