import assert from "node:assert/strict";
import test from "node:test";
import type { ReclassifiedBalanceSheetRow } from "../../../types/reclassifiedBalanceSheetV2";
import {
  FINANCIAL_STATEMENT_TABS,
  canExpandReclassifiedRow,
  deriveReclassifiedRows,
  formatBalanceDifference,
  formatReclassifiedCurrency,
  getBalanceCheckStatus,
  getScenarioColumns,
  sortByDisplayOrder,
} from "./reclassifiedBalanceSheet.utils.ts";

const row = (
  code: string,
  statementKey: "asset" | "liability",
  displayOrder: number,
  value?: number,
): ReclassifiedBalanceSheetRow => ({
  code,
  statementKey,
  name: code,
  rowType: code === "BALANCE_DIFFERENCE" ? "validation" : "section",
  displayOrder,
  expandable: false,
  source: { sourceType: "calculated", sourceId: null },
  values:
    value === undefined ? {} : { realizado: { accumulated: value } },
});

test("exibe somente BP Reclassificado e DRE na navegação", () => {
  assert.deepEqual(
    FINANCIAL_STATEMENT_TABS.map((tab) => tab.label),
    ["BP Reclassificado", "DRE"],
  );
});

test("separa e ordena Ativo e Passivo sem incluir BALANCE_DIFFERENCE", () => {
  const result = deriveReclassifiedRows([
    row("LIABILITY_2", "liability", 2),
    row("ASSET_2", "asset", 2),
    row("BALANCE_DIFFERENCE", "liability", 99, 0),
    row("ASSET_1", "asset", 1),
    row("LIABILITY_1", "liability", 1),
  ]);

  assert.deepEqual(result.assetRows.map((item) => item.code), [
    "ASSET_1",
    "ASSET_2",
  ]);
  assert.deepEqual(result.liabilityRows.map((item) => item.code), [
    "LIABILITY_1",
    "LIABILITY_2",
  ]);
  assert.equal(result.balanceDifferenceRow?.code, "BALANCE_DIFFERENCE");
});

test("ordena períodos e cenários por displayOrder", () => {
  assert.deepEqual(
    sortByDisplayOrder([
      { key: "feb", displayOrder: 2 },
      { key: "jan", displayOrder: 1 },
    ]).map((item) => item.key),
    ["jan", "feb"],
  );

  const scenarios = [
    { key: "variacao" as const, label: "Variação", displayOrder: 3 },
    { key: "realizado" as const, label: "Realizado", displayOrder: 1 },
    { key: "orcado" as const, label: "Orçado", displayOrder: 2 },
  ];
  assert.deepEqual(
    getScenarioColumns(scenarios, true).map((item) => item.key),
    ["orcado", "realizado", "variacao"],
  );
  assert.deepEqual(
    getScenarioColumns(scenarios, false).map((item) => item.key),
    ["realizado"],
  );
});

test("distingue zero, diferença e valor ausente sem recalcular", () => {
  assert.equal(getBalanceCheckStatus(0), "success");
  assert.equal(getBalanceCheckStatus(-10), "error");
  assert.equal(getBalanceCheckStatus(undefined), "neutral");
});

test("formata zero, ausência e negativos sem perder a semântica", () => {
  assert.equal(formatReclassifiedCurrency(0, "TOTAL"), "0");
  assert.equal(formatReclassifiedCurrency(undefined, "TOTAL"), "-");
  assert.equal(formatReclassifiedCurrency(-1234, "TOTAL"), "(1.234)");
});

test("exibe expansão sempre que a linha vier marcada como expandable", () => {
  assert.equal(canExpandReclassifiedRow({ expandable: true }), true);
  assert.equal(canExpandReclassifiedRow({ expandable: false }), false);
});

test("preserva os decimais exatos na diferença do balanço", () => {
  assert.equal(formatBalanceDifference(1234.56, "TOTAL"), "1.234,56");
  assert.equal(formatBalanceDifference(-0.125, "TOTAL"), "(0,125)");
  assert.equal(formatBalanceDifference(0, "TOTAL"), "0,00");
  assert.equal(formatBalanceDifference(undefined, "TOTAL"), "-");
});
