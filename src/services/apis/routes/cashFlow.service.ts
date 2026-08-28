import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export const getCashFlow = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/CashFlow`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCashFlowRolling = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/rolling`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
