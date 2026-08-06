import type { IDatasource, IGetRowsParams } from "ag-grid-community";
import type {
  TrialBalanceViewerFilters,
  TrialBalanceViewerQuery,
  TrialBalanceViewerResponse,
} from "../../../types/trialBalanceViewer";
import { buildViewerQuery } from "./viewer.utils.ts";

type LoadViewerRows = (
  trialBalanceId: number,
  query: TrialBalanceViewerQuery,
  signal: AbortSignal,
) => Promise<TrialBalanceViewerResponse>;

type ViewerDatasourceOptions = {
  trialBalanceId: number;
  filters: TrialBalanceViewerFilters;
  loadRows: LoadViewerRows;
  onRequestStarted: () => void;
  onRequestFinished: () => void;
  onFirstPageSuccess: (total: number) => void;
  onFirstPageError: (error: unknown) => void;
  onAdditionalPageError: (error: unknown) => void;
};

export const createTrialBalanceDatasource = ({
  trialBalanceId,
  filters,
  loadRows,
  onRequestStarted,
  onRequestFinished,
  onFirstPageSuccess,
  onFirstPageError,
  onAdditionalPageError,
}: ViewerDatasourceOptions): IDatasource => {
  let active = true;
  const controllers = new Set<AbortController>();

  return {
    getRows: (params: IGetRowsParams) => {
      const controller = new AbortController();
      controllers.add(controller);
      onRequestStarted();

      const query = buildViewerQuery(
        params.startRow,
        params.endRow,
        filters,
        params.sortModel,
      );

      void loadRows(trialBalanceId, query, controller.signal)
        .then((response) => {
          if (!active || controller.signal.aborted) return;

          params.successCallback(response.items, response.pagination.total);

          if (params.startRow === 0) {
            onFirstPageSuccess(response.pagination.total);
          }
        })
        .catch((error: unknown) => {
          if (!active || controller.signal.aborted) return;

          params.failCallback();

          if (params.startRow === 0) {
            onFirstPageError(error);
          } else {
            onAdditionalPageError(error);
          }
        })
        .finally(() => {
          controllers.delete(controller);
          onRequestFinished();
        });
    },
    destroy: () => {
      active = false;
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    },
  };
};
