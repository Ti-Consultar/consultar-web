import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

export const getLiquidityManagement = async (
  accountPlanId: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity-management`,
      {
        params: { accountPlanId, year },
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
  month: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity-management/month`,
      {
        params: { accountPlanId, year, month },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalDynamics = async (
  accountPlanId: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-dynamics`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTurnover = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/turnover`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLiquidity = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/liquidity`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGrossCashFlow = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/gross-cash-flow`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCapitalStructure = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/LiquidManagement/capital-structure`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
