import { env } from "../../../config/env";
import { GroupFormData } from "../../../types/group";
import { axiosInstanceWithoutToken, axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //Somente para fins de mocking

export const getAllGroups = async () => {
  await delay(1500); //to-do: Remover quando o backend estiver pronto

  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/Group/all`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupsByUserId = async () => {
  try {
    const response = await axiosInstanceWithoutToken.get(`${URL}/api/Group/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeletedGroups = async () => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Group/deleted`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreGroups = async (data: number[]) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/Group/restore`, data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupUsers = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Group/${id}/users`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveGroup = async (data: GroupFormData) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Group/create`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/Group/${id}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGroup = async (id: number, data: GroupFormData) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/api/Group/${id}/update`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupById = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Group/detail/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
