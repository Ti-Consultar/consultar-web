import { env } from "../../../config/env";
import { ProfileChanges } from "../../../types/profile";
import { axiosInstanceWithToken } from "../config";

const BASE_URL = env.api.auth;

// Profile info

export const getProfileInfo = async () => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${BASE_URL}/simple`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editUserInfo = async (data: ProfileChanges) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${BASE_URL}/User`, data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
