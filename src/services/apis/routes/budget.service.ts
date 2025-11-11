import { BalancetePayload } from "../../../types/balancetePayload";
import { axiosInstanceWithToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

export const submitBudget = async (data: BalancetePayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Budget`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBudget = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Budget/${balanceteId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBudgets = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Budget/accountplan/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importBudgetSheet = async (data: File, balanceteId: number) => {
  const fileData = new FormData();
  fileData.append("file", data);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Budget/import`,
      fileData,
      {
        params: { balanceteId },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBudget = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(
      `${URL}/api/Budget/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
