import { axiosInstanceWithToken } from "../config";
const URL = import.meta.env.VITE_API_URL_MRP;

type AccountPlanPayload = {
    groupId: number,
    companyId?: number,
    subCompanyId?: number
}

export type ImportedAccount = {
  id: number;
  accountPlanId: number;
  costCenter: string;
  name: string;
  accountPlanClassificationId: number | null;
  classificationStatus: string;
  origin: string;
  createdAt: string;
  updatedAt: string | null;
};

export type ImportAccountPlanResponse = {
  message: string;
  importedAccountsCount: number;
  newAccountsCount: number;
  updatedAccountsCount: number;
  sourceMode: string;
  newAccounts: ImportedAccount[];
};

type ApiResponse<T> = {
  data?: T;
  success?: boolean;
  message?: string;
  errorMessage?: string[];
};

export const getAccountPlan = async (groupId: number, companyId?: number, subCompanyId?: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/AccountPlans/list`,
      {
        params: {
          groupId,
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

export const createAccountPlan = async (data: AccountPlanPayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/AccountPlans`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importAccountPlanAccounts = async (
  file: File,
  accountPlanId: number
): Promise<ImportAccountPlanResponse> => {
  const fileData = new FormData();
  fileData.append("file", file);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/AccountPlans/${accountPlanId}/accounts/import`,
      fileData
    );

    const responseData = response.data as
      | ApiResponse<ImportAccountPlanResponse>
      | ImportAccountPlanResponse;

    if ("data" in responseData && responseData.data) {
      return responseData.data;
    }

    return responseData as ImportAccountPlanResponse;
  } catch (error) {
    throw error;
  }
};
