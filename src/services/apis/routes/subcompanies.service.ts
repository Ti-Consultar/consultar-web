const URL = import.meta.env.VITE_API_URL_MRP;
import { GroupFormData } from "../../../types/group";
import { axiosInstanceWithToken, axiosIntanceWithoutToken } from "../config";

export const getBranches = async (companyId: number, skip = 0, take = 10) => {
  try {
    const { data } = await axiosInstanceWithToken.get(
      `${URL}/api/SubCompany/company/${companyId}/paginated`,
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

export const getSubCompanyById = async (id: number, companyId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/SubCompany/${id}/company/${companyId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCompany = async (data: GroupFormData, id: number) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/api/SubCompany`,
      data,
      {
        params: { id },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveSubCompany = async (data: GroupFormData) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/SubCompany`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeletedSubCompanies = async (
  companyId: number,
  skip: number,
  take: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/SubCompany/company/${companyId}/paginated/deleted`,
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
  id: number
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/SubCompany/${subCompanyId}/company/${id}/delete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreSubCompanies = async (
  companyId: number,
  data: number[]
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/SubCompany/company/${companyId}/subcompanies/restore`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
