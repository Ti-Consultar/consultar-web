import { Breadcrumb } from "../../../types/breadcrumb";
import { axiosIntanceWithoutToken } from "../config";

const URL = import.meta.env.VITE_API_URL_MRP;

export const getBreadcrumb = async ({ id, type }: Breadcrumb) => {
  try {
    const response = await axiosIntanceWithoutToken.get(
      `${URL}/api/Breadcrumb/${id}/${type}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
