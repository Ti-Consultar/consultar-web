import { GroupFormData } from "../../../types/group";
import { axiosInstanceWithToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

interface JwtPayload {
  unique_name: string;
  role: string;
  userId: string;
  nbf: number;
  exp: number;
  iat: number;
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //Somente para fins de mocking

export const deleteCompany = async (
  id: number,
  groupId: number,
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/Company/${id}/group/${groupId}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanies = async (groupId: number) => {
  await delay(1500); //to-do: Remover quando o backend estiver pronto

  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Company/group/${groupId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeletedCompanies = async (groupId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Company/group/${groupId}/deleted`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveCompany = async (data: GroupFormData) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Company/create`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompany = async (data: GroupFormData, id: number) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/api/Company/update/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreCompanies = async (
  groupId: number,
  data: number[]
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/Company/group/${groupId}/restore`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyById = async (
  id: number,
  groupId: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Company/${id}/group/${groupId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
