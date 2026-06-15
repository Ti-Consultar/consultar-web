import { env } from "../../../config/env";
import { invitations } from "../../../types/userInvitationPayload";
import { axiosInstanceWithToken, axiosInstanceWithoutToken } from "../config";

const URL = env.api.mrp;

export const unlinkFromCompany = async (
  userId: number,
  groupId: number,
  companyId?: number,
  subCompanyId?: number
) => {
  try {
    const response = await axiosInstanceWithoutToken.delete(
      `${URL}/api/Invitation/companyuser/${userId}/group/${groupId}`,
      {
        params: {
          companyId,
          subCompanyId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const inviteUser = async (data: invitations) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Invitation/create`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const acceptOrDeclineInvite = async (
  id: number,
  data: { status: number }
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `${URL}/api/Invitation/${id}/update-status`,
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
