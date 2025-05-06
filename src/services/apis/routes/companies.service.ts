import { GroupFormData } from "../../../types/group";
import { axiosInstanceWithToken, axiosIntanceWithoutToken } from "../config";
import { jwtDecode } from "jwt-decode";

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

const getUserIdFromCookie = (): string | null => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    console.error("Token não encontrado.");
    return null;
  }

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    return decoded.userId;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

export const deleteCompany = async (
  id: number,
  groupId: number,
  userId: number
) => {
  try {
    const response = await axiosIntanceWithoutToken.patch(
      `${URL}/api/Company/user/${userId}/group/${groupId}/company/${id}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanies = async (groupId: number) => {
  const userId = getUserIdFromCookie();
  if (!userId) throw new Error("UserId não encontrado no cookie.");
  await delay(1500); //to-do: Remover quando o backend estiver pronto

  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Company/user/${userId}/group/${groupId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeletedCompanies = async (userId: number, groupId: number) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/Company/user/${userId}/group/${groupId}/deleted`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveCompany = async (data: GroupFormData) => {
  try {
    const response = await axiosIntanceWithoutToken.post(
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
    const response = await axiosIntanceWithoutToken.put(
      `${URL}/api/Company/update/id/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreCompanies = async (
  userId: number,
  groupId: number,
  data: number[]
) => {
  try {
    const response = await axiosIntanceWithoutToken.patch(
      `${URL}/api/Company/user/${userId}/group/${groupId}/companies/restore`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyById = async (
  id: number,
  userId: number,
  groupId: number
) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/Company/${id}/user/${userId}/group/${groupId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
