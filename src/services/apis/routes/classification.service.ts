import { BondListWrapper } from "../../../types/classification";
import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

export const getClassification = async (typeClassification: number, accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Classification/accountPlan/${accountPlanId}/typeClassification`,
      { params: { typeClassification } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClassificationTemplate = async (typeClassification: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Classification/template/typeClassification`,
      { params: { typeClassification } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalancoContabil = async (accountPlanId: number, year: number, typeClassification: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/painel`,
      { params: { 
        accountPlanId,
        year,
        typeClassification
       } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateClassificationModel = async (accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Classification/exists`,
      { params: { accountPlanId } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

type SendAccountPlan = {
  accountPlanId: number;
};

export const sendAccountPlanId = async (data: SendAccountPlan) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Classification`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const classify = async (data: BondListWrapper) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/create-bond-list`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
