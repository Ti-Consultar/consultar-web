import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getDashboardData = async (
  year: number,
  accountPlanId: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/DashBoard`, {
      params: {
        ...buildFinancialScopeParams(accountPlanId, scope),
        year,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGestaoPrazoMedio = async (
  year: number,
  accountPlanId: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/DashBoard/gestao-prazo-medio`,
      {
        params: {
          ...buildFinancialScopeParams(accountPlanId, scope),
          year,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
