import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getOperationalEfficieny = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/OperationalEfficiency`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOperationalEfficienyVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/orcado`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
