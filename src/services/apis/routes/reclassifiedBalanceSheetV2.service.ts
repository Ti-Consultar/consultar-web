import { env } from "../../../config/env";
import {
  ReclassifiedBalanceSheetParams,
  ReclassifiedBalanceSheetResponse,
} from "../../../types/reclassifiedBalanceSheetV2";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;
const inFlightRequests = new Map<
  string,
  Promise<ReclassifiedBalanceSheetResponse>
>();

export const getReclassifiedBalanceSheetV2 = async (
  params: ReclassifiedBalanceSheetParams,
): Promise<ReclassifiedBalanceSheetResponse> => {
  const requestKey = JSON.stringify(params);
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const request = axiosInstanceWithToken
    .get<ReclassifiedBalanceSheetResponse>(
      `${URL}/api/v2/reclassified-balance-sheet`,
      { params },
    )
    .then((response) => response.data)
    .finally(() => inFlightRequests.delete(requestKey));

  inFlightRequests.set(requestKey, request);

  return request;
};
