import { axiosInstanceWithToken, axiosIntanceWithoutToken } from '../config';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL_BASE;
const MRP_URL = import.meta.env.VITE_API_URL_MRP;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string) => {
  await delay(1000);
  try {
    const response = await axiosInstanceWithToken.post(`${BASE_URL}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      const token = response.data.token;

      Cookies.set('token', token, { expires: 1, secure: true });
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setNewPassword = async (email: string) => {
  await delay(1000);
  try {
    const response = await axiosIntanceWithoutToken.put(`${BASE_URL}/User/redefine-password`, {
      email,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPolicies = async () => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${MRP_URL}/api/Permission/permissions`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
