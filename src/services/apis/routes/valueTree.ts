import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getValueTree = async (
  accountPlanId: number,
  month: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/ValueTree`, {
      params: { ...buildFinancialScopeParams(accountPlanId, scope), month, year },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getValueTreeBudget = async (
  accountPlanId: number,
  month: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/ValueTree/variacao`, {
      params: { ...buildFinancialScopeParams(accountPlanId, scope), month, year },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
