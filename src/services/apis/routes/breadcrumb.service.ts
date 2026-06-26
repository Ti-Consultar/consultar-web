import { env } from "../../../config/env";
import {
  Breadcrumb,
  BreadcrumbResolveParams,
  BreadcrumbResolveResponseItem,
} from "../../../types/breadcrumb";
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

export const resolveBreadcrumb = async ({
  routeKey,
  groupId,
  companyId,
  subCompanyId,
  balanceteId,
}: BreadcrumbResolveParams): Promise<BreadcrumbResolveResponseItem[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get(
      `${URL}/api/Breadcrumb/resolve`,
      {
        params: {
          routeKey,
          groupId,
          companyId,
          subCompanyId,
          balanceteId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
