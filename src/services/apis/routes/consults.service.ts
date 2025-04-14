import axios from "axios";
import { companyInfo } from "../../../types/cnpj";
import { CEP } from "../../../types/cep";

const URL = import.meta.env.VITE_API_URL_CONSULTS;

export const getEmpresaByCnpj = async (cnpj: string): Promise<companyInfo> => {
  try {
    const response = await axios.get<{ data: companyInfo }>(
      `${URL}/api/Cnpj/${cnpj}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar empresa por CNPJ:", error);
    throw error;
  }
};

export const getAddressByCep = async (cep: string): Promise<CEP> => {
  try {
    const response = await axios.get<{ data: CEP }>(
      `${URL}/api/cep/${cep}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar empresa por CEP:", error);
    throw error;
  }
};
