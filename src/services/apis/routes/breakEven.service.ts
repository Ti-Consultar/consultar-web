import { env } from "../../../config/env";
import type {
  BreakEvenQuery,
  BreakEvenResponse,
  BreakEvenSimulationRequest,
} from "../../../types/breakEven";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

export const getBreakEvenV2 = async (
  params: BreakEvenQuery,
): Promise<BreakEvenResponse> => {
  const response = await axiosInstanceWithToken.get<BreakEvenResponse>(
    `${URL}/api/v2/break-even`,
    { params },
  );

  return response.data;
};

export const simulateBreakEvenV2 = async (
  payload: BreakEvenSimulationRequest,
): Promise<BreakEvenResponse> => {
  const response = await axiosInstanceWithToken.post<BreakEvenResponse>(
    `${URL}/api/v2/break-even/simulate`,
    payload,
  );

  return response.data;
};
