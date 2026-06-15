import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

export const getParams = async (accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/Parameter`, {
      params: { accountPlanId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getParamsById = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveParam = async (data: any) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Parameter`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editParam = async (data: any) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/api/Parameter`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteParam = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(`${URL}/api/Parameter`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
