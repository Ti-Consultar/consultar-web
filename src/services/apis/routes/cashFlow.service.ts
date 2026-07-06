import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getCashFlow = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      scope?.groupId ? `${URL}/api/CashFlow/scope` : `${URL}/api/CashFlow`,
      {
        params: scope?.groupId
          ? { year, ...buildScopeParams(scope) }
          : { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCashFlowVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      scope?.groupId ? `${URL}/api/CashFlow/scope` : `${URL}/variacao`,
      {
        params: scope?.groupId
          ? { year, ...buildScopeParams(scope) }
          : { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
