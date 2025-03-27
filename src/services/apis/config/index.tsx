import axios from 'axios';
import Cookies from 'js-cookie';

const axiosIntanceWithoutToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

const axiosInstanceWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

axiosInstanceWithToken.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosIntanceWithoutToken, axiosInstanceWithToken };
