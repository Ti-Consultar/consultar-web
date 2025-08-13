import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

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
