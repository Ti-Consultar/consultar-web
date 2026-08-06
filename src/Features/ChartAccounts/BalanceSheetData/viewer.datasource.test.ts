import assert from "node:assert/strict";
import test from "node:test";
import type { IGetRowsParams } from "ag-grid-community";
import type { TrialBalanceViewerResponse } from "../../../types/trialBalanceViewer.ts";
import { createTrialBalanceDatasource } from "./viewer.datasource.ts";

const emptyResponse: TrialBalanceViewerResponse = {
  trialBalanceId: 20862,
  items: [],
  pagination: {
    offset: 0,
    limit: 200,
    returned: 0,
    total: 0,
    hasMore: false,
  },
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

test("entrega items e pagination.total ao callback da grade", async () => {
  let receivedQuery: unknown;
  let receivedRows: unknown[] = [];
  let receivedTotal = -1;
  let firstPageTotal = -1;

  const datasource = createTrialBalanceDatasource({
    trialBalanceId: 20862,
    filters: { search: "", levels: [], onlyWithMovement: false },
    loadRows: async (_id, query) => {
      receivedQuery = query;
      return emptyResponse;
    },
    onRequestStarted: () => undefined,
    onRequestFinished: () => undefined,
    onFirstPageSuccess: (total) => {
      firstPageTotal = total;
    },
    onFirstPageError: () => assert.fail("não deveria falhar"),
    onAdditionalPageError: () => assert.fail("não deveria falhar"),
  });

  datasource.getRows({
    startRow: 0,
    endRow: 200,
    sortModel: [],
    successCallback: (rows: unknown[], total?: number) => {
      receivedRows = rows;
      receivedTotal = total ?? -1;
    },
    failCallback: () => assert.fail("não deveria falhar"),
  } as unknown as IGetRowsParams);

  await flushPromises();

  assert.deepEqual(receivedQuery, {
    offset: 0,
    limit: 200,
    sort: "sourceOrder",
    direction: "asc",
    onlyWithMovement: false,
  });
  assert.deepEqual(receivedRows, []);
  assert.equal(receivedTotal, 0);
  assert.equal(firstPageTotal, 0);
});

test("ignora uma resposta antiga depois que o datasource é descartado", async () => {
  let resolveRequest: (response: TrialBalanceViewerResponse) => void = () =>
    undefined;
  let successCalled = false;

  const datasource = createTrialBalanceDatasource({
    trialBalanceId: 20862,
    filters: { search: "antiga", levels: [], onlyWithMovement: false },
    loadRows: () =>
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    onRequestStarted: () => undefined,
    onRequestFinished: () => undefined,
    onFirstPageSuccess: () => undefined,
    onFirstPageError: () => undefined,
    onAdditionalPageError: () => undefined,
  });

  datasource.getRows({
    startRow: 0,
    endRow: 200,
    sortModel: [],
    successCallback: () => {
      successCalled = true;
    },
    failCallback: () => undefined,
  } as unknown as IGetRowsParams);

  datasource.destroy?.();
  resolveRequest(emptyResponse);
  await flushPromises();

  assert.equal(successCalled, false);
});

test("preserva a grade e sinaliza falha em blocos adicionais", async () => {
  let gridFailureCalled = false;
  let additionalFailureCalled = false;

  const datasource = createTrialBalanceDatasource({
    trialBalanceId: 20862,
    filters: { search: "", levels: [], onlyWithMovement: false },
    loadRows: async () => {
      throw new Error("offline");
    },
    onRequestStarted: () => undefined,
    onRequestFinished: () => undefined,
    onFirstPageSuccess: () => undefined,
    onFirstPageError: () => assert.fail("não é a primeira página"),
    onAdditionalPageError: () => {
      additionalFailureCalled = true;
    },
  });

  datasource.getRows({
    startRow: 200,
    endRow: 400,
    sortModel: [],
    successCallback: () => assert.fail("não deveria concluir"),
    failCallback: () => {
      gridFailureCalled = true;
    },
  } as unknown as IGetRowsParams);

  await flushPromises();

  assert.equal(gridFailureCalled, true);
  assert.equal(additionalFailureCalled, true);
});
