import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export const getValueTree = async (
  accountPlanId: number,
  month: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/ValueTree`, {
      params: { accountPlanId, month, year },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getValueTreeBudget = async (
  accountPlanId: number,
  month: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/ValueTree/variacao`, {
      params: { accountPlanId, month, year },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
