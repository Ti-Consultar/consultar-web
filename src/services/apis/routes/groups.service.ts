import { GroupFormData } from "../../../types/group";
import { axiosIntanceWithoutToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //Somente para fins de mocking

export const getAllGroups = async () => {
  await delay(1500); //to-do: Remover quando o backend estiver pronto

  try {
    const response = await axiosIntanceWithoutToken.get(`${URL}/api/Group/all`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupsByUserId = async (userId: number) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/Group/user/${userId}/groups`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveGroup = async (data: GroupFormData) => {
  try {
    const response = await axiosIntanceWithoutToken.post(
      `${URL}/api/Group/create`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = async (id: number, userId: number) => {
  try {
    const response = await axiosIntanceWithoutToken.patch(
      `${URL}/api/Group/user/${userId}/group/${id}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGroup = async (
  id: number,
  userId: number,
  data: GroupFormData
) => {
  try {
    const response = await axiosIntanceWithoutToken.put(
      `${URL}/api/Group/update/id/${id}/user/${userId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupById = async (id: number, userId: number) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/Group/user/${userId}/group/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
