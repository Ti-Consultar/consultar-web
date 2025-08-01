import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

export const getProfitability = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/profitability`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRentability = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/rentability`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReturnExpectation = async (
  accountPlanId: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/return-expectation`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEbitida = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/ebitda`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNopat = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/EconomicIndices/nopat`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
