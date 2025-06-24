import { BalancetePayload } from "../../../types/balancetePayload";
import { axiosInstanceWithToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

export const submitAccounting = async (data: BalancetePayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Balancete`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalancete = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceteData = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}/data`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceteByCostCenter = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}/cost-center`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalancetes = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importAccounting = async (data: File, balanceteId: number) => {
  const fileData = new FormData();
  fileData.append("file", data);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Balancete/import`,
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
