import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export const getOperationalEfficieny = async (
  accountPlanId: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/OperationalEfficiency`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOperationalEfficienyVariation = async (
  accountPlanId: number,
  year: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/orcado`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
