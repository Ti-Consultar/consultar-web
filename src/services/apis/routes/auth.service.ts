import { axiosIntanceWithoutToken } from '../config';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL_BASE;

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosIntanceWithoutToken.post(`${BASE_URL}/login`, {
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
