import { env } from "../../../config/env";
import type { ReclassifiedBalanceSheetResponse } from "../../../types/reclassifiedBalanceSheetV2";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

interface AccountingBalanceSheetV2Params {
  accountPlanId: number;
  year: number;
}

export const getAccountingBalanceSheetV2 = async (
  params: AccountingBalanceSheetV2Params,
): Promise<ReclassifiedBalanceSheetResponse> => {
  const response = await axiosInstanceWithToken.get<ReclassifiedBalanceSheetResponse>(
    `${URL}/v2/painel`,
    { params },
  );

  return response.data;
};
