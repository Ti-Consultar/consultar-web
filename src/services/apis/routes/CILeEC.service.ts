import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

export const getCILeEC = async (accountPlanId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/CILeEC/cil-ec`,
      {
        params: { accountPlanId, year },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
