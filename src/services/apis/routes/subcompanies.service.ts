const URL = import.meta.env.VITE_API_URL_MRP;
import { GroupFormData } from "../../../types/group";
import { axiosInstanceWithToken, axiosIntanceWithoutToken } from "../config";

export const getBranches = async (
  companyId: number,
  userId: number,
  skip = 0,
  take = 10
) => {
  if (!userId) throw new Error("UserId não encontrado no cookie.");

  try {
    const { data } = await axiosInstanceWithToken.get(
      `${URL}/api/SubCompany/paginated/user/${userId}/company/${companyId}`,
      {
        params: { skip, take },
      }
    );

    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Erro na requisição de branches."
    );
  }
};

export const getSubCompanyById = async (
  id: number,
  userId: number,
  companyId: number
) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/SubCompany/${id}/user/${userId}/company/${companyId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveSubCompany = async (data: GroupFormData) => {
  try {
    const response = await axiosIntanceWithoutToken.post(
      `${URL}/api/SubCompany/create`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCompany = async (data: GroupFormData, id: number) => {
  try {
    const response = await axiosIntanceWithoutToken.put(
      `${URL}/api/SubCompany/update/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeletedSubCompanies = async (
  userId: number,
  companyId: number,
  skip: number,
  take: number
) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/SubCompany/paginated/user/${userId}/company/${companyId}/deleted`,
      {
        params: { skip, take },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubCompany = async (
  subCompanyId: number,
  userId: number,
  id: number
) => {
  try {
    const response = await axiosIntanceWithoutToken.patch(
      `${URL}/api/SubCompany/${subCompanyId}/user/${userId}/company/${id}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreSubCompanies = async (
  userId: number,
  companyId: number,
  data: number[]
) => {
  try {
    const response = await axiosIntanceWithoutToken.patch(
      `${URL}/api/SubCompany/user/${userId}/company/${companyId}/subcompanies/restore`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
