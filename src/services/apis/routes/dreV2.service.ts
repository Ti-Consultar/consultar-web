import { env } from "../../../config/env";
import { DreV2Response } from "../../../types/dreV2";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

export const getDreV2 = async (
  accountPlanId: number,
  year: number,
): Promise<DreV2Response> => {
  const response = await axiosInstanceWithToken.get<DreV2Response>(
    `${URL}/api/v2/dre`,
    { params: { accountPlanId, year } },
  );

  return response.data;
};
