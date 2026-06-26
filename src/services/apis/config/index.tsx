import axios from "axios";
import { toast } from "sonner";
import { env } from "../../../config/env";
import { getAuthToken, removeAuthToken } from "../../../utils/authToken";

const axiosInstanceWithoutToken = axios.create({
  baseURL: env.api.auth,
});

const axiosInstanceWithToken = axios.create({
  baseURL: env.api.auth,
});

const redirectToLogin = () => {
  if (env.isElectron) {
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
