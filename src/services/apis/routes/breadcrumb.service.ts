import { env } from "../../../config/env";
import { Breadcrumb } from "../../../types/breadcrumb";
import { axiosInstanceWithoutToken } from "../config";

const URL = env.api.mrp;

export const getBreadcrumb = async ({ id, type }: Breadcrumb) => {
  try {
    const response = await axiosInstanceWithoutToken.get(
      `${URL}/api/Breadcrumb/${id}/${type}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
