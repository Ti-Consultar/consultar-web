import { Breadcrumb } from "../../../types/breadcrumb";
import { axiosInstanceWithoutToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

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
