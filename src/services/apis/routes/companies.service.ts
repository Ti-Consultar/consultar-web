import { axiosInstanceWithToken } from '../config';
import {jwtDecode} from "jwt-decode";

const URL = import.meta.env.VITE_API_URL_MRP;

interface JwtPayload {
  unique_name: string;
  role: string;
  userId: string;
  nbf: number;
  exp: number;
  iat: number;
}

const getUserIdFromCookie = (): string | null => {
  const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

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

export const getCompanies = async () => {
    const userId  = getUserIdFromCookie();
    if (!userId) throw new Error("UserId não encontrado no cookie.");

    try {
      const response = await axiosInstanceWithToken.get(
        `${URL}/api/Company/companies/user/${userId}`
      );
  
      return response.data;
    } catch (error) {
      throw error;
    };
}