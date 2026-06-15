import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export const getDashboardData = async (year: number, accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/DashBoard`, {
      params: {
        accountPlanId,
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
  accountPlanId: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/DashBoard/gestao-prazo-medio`,
      {
        params: {
          accountPlanId,
          year,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
