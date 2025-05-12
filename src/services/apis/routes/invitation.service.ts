import { axiosIntanceWithoutToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

export const unlinkFromCompany = async (userId: number, groupId: number, companyId?: number, subCompanyId?: number) => {
  try {
    const response = await axiosIntanceWithoutToken.delete(
      `${URL}/api/Invitation/companyuser/${userId}/group/${groupId}`, {
        params: {
            companyId,
            subCompanyId 
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
