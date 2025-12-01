import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const axiosInstanceWithoutToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

const axiosInstanceWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

axiosInstanceWithToken.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      toast.error("Sua sessão expirou. Faça login novamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

axiosInstanceWithoutToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      toast.error("Sua sessão expirou. Faça login novamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { axiosInstanceWithoutToken, axiosInstanceWithToken };
