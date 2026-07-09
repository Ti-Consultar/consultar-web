import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getProfitability = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/profitability`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfitabilityBudget = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/profitability/orcado`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRentability = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/rentability/orcado`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReturnExpectation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/return-expectation/orcado`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEbitida = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/ebitda`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEbitidaBudget = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/ebitda/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNopat = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/nopat/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
