import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getCILeEC = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/CILeEC/cil-ec`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCILeECWithBudget = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/CILeEC/cil-ec/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
