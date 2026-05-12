import axios from "axios";
import { toast } from "sonner";
import { getAuthToken, removeAuthToken } from "../../../utils/authToken";

const axiosInstanceWithoutToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

const axiosInstanceWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
});

const redirectToLogin = () => {
  if (import.meta.env.VITE_ELECTRON === "true") {
    window.location.hash = "/login";
    return;
  }

  window.location.href = "/login";
};

axiosInstanceWithToken.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstanceWithToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      toast.error("Sua sessao expirou. Faca login novamente.");

      removeAuthToken();
      localStorage.removeItem("userData");

      redirectToLogin();
    }
    return Promise.reject(error);
  },
);

axiosInstanceWithoutToken.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export { axiosInstanceWithoutToken, axiosInstanceWithToken };
