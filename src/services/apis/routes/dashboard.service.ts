import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export interface DashboardLatestPeriod {
  year: number;
  month: number;
}

export const getDashboardLatestPeriod = async (
  accountPlanId: number,
): Promise<DashboardLatestPeriod> => {
  const response = await axiosInstanceWithToken.get<DashboardLatestPeriod>(
    `${URL}/api/DashBoard/latest-period`,
    {
      params: { accountPlanId },
    },
  );

  return response.data;
};

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
