import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

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

export const deleteNotification = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(`${URL}/api/Invitation/${id}/delete`);

    return response.data;
  } catch (error) {
    throw error;
  }
};
