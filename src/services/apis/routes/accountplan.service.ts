import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

type AccountPlanPayload = {
    groupId: number,
    companyId?: number,
    subCompanyId?: number
}

export const getAccountPlan = async (groupId: number, companyId?: number, subCompanyId?: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/AccountPlans/list`,
      {
        params: {
          groupId,
          companyId,
          subCompanyId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccountPlan = async (data: AccountPlanPayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/AccountPlans`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
