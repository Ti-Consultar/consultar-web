import { axiosInstanceWithToken } from "../config";

const BASE_URL = import.meta.env.VITE_API_URL_BASE;

// Profile info

export const getProfileInfo = async (userId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${BASE_URL}/${userId}/simple`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};