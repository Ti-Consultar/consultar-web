import { axiosInstanceWithToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

export const getUserInvitesNotifications = async () => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/Invitation/received`);

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getSentNotifications = async () => {
  try {
    const response = await axiosInstanceWithToken.get(`${URL}/api/Invitation/sent`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
