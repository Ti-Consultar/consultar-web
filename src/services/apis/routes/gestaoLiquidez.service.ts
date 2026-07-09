import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
import { buildFinancialScopeParams } from "./scope";
import type { FinancialScope } from "./scope";
const URL = env.api.mrp;

export const getLiquidityManagement = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity-management`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidityManagementVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity-management/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidityMonth = async (
  accountPlanId: number,
  year: number,
  month: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity-management/month`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year, month },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalDynamics = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-dynamics`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalDynamicsVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-dynamics/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTurnover = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/turnover`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTurnoverVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/turnover/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidity = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidityVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGrossCashFlow = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/gross-cash-flow`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGrossCashFlowVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/gross-cash-flow/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalStructure = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-structure`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalStructureVariation = async (
  accountPlanId: number,
  year: number,
  scope?: FinancialScope,
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-structure/variacao`,
      {
        params: { ...buildFinancialScopeParams(accountPlanId, scope), year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
