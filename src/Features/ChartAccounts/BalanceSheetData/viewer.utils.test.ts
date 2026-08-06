import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTrialBalanceViewerPath,
  buildViewerQuery,
  formatTrialBalanceAmount,
  getTrialBalanceListPath,
  getViewerErrorKind,
  normalizeHierarchyLevels,
  scheduleDebouncedSearch,
} from "./viewer.utils.ts";

test("monta os parâmetros iniciais sem enviar filtros vazios", () => {
  assert.deepEqual(
    buildViewerQuery(
      0,
      200,
      { search: "", levels: [], onlyWithMovement: false },
      [],
    ),
    {
      offset: 0,
      limit: 200,
      sort: "sourceOrder",
      direction: "asc",
      onlyWithMovement: false,
    },
  );
});

test("mapeia busca, níveis, movimento e ordenação simples", () => {
  assert.deepEqual(
    buildViewerQuery(
      200,
      400,
      { search: "  caixa  ", levels: [3, 1, 2], onlyWithMovement: true },
      [{ colId: "finalBalance", sort: "desc" }],
    ),
    {
      offset: 200,
      limit: 200,
      search: "caixa",
      levels: "1,2,3",
      onlyWithMovement: true,
      sort: "finalBalance",
      direction: "desc",
    },
  );
});

test("ignora ordenação desconhecida e restaura sourceOrder asc", () => {
  const query = buildViewerQuery(
    0,
    200,
    { search: "", levels: [], onlyWithMovement: false },
    [{ colId: "unsupported", sort: "desc" }],
  );

  assert.equal(query.sort, "sourceOrder");
  assert.equal(query.direction, "asc");
});

test("aplica debounce e permite cancelar uma busca antiga", async () => {
  const received: string[] = [];
  const cancelOldSearch = scheduleDebouncedSearch(
    (value) => received.push(value),
    "antiga",
    10,
  );
  cancelOldSearch();
  scheduleDebouncedSearch((value) => received.push(value), "nova", 10);

  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.deepEqual(received, ["nova"]);
});

test("constrói navegação por ID e retorno à listagem em todos os escopos", () => {
  assert.equal(
    buildTrialBalanceViewerPath(
      "/grupos/1/empresas/2/arquivos/upload/balancete",
      20862,
    ),
    "/grupos/1/empresas/2/balancetes/20862",
  );
  assert.equal(
    buildTrialBalanceViewerPath("/grupos/13010/balancetes", 20844),
    "/grupos/13010/balancetes/20844",
  );
  assert.equal(
    getTrialBalanceListPath("/grupos/1/empresas/2/balancetes/20862"),
    "/grupos/1/empresas/2/balancetes",
  );
});

test("distingue 404 de falhas genéricas", () => {
  assert.equal(getViewerErrorKind({ response: { status: 404 } }), "not-found");
  assert.equal(getViewerErrorKind({ response: { status: 500 } }), "generic");
  assert.equal(getViewerErrorKind(new Error("offline")), "generic");
});

test("formata valores monetários no padrão brasileiro com duas casas", () => {
  assert.equal(formatTrialBalanceAmount(1234.5), "1.234,50");
  assert.equal(formatTrialBalanceAmount(-20), "-20,00");
  assert.equal(formatTrialBalanceAmount(0), "0,00");
});

test("seleciona graus contábeis sempre com seus pais hierárquicos", () => {
  assert.deepEqual(normalizeHierarchyLevels([3]), [1, 2, 3]);
  assert.deepEqual(normalizeHierarchyLevels([1, 3, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(normalizeHierarchyLevels([4]), [1, 2, 3, 4]);
  assert.deepEqual(normalizeHierarchyLevels([2]), [1, 2]);
  assert.deepEqual(normalizeHierarchyLevels([]), []);
});
