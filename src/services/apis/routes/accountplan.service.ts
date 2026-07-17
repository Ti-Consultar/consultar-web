import { env } from "../../../config/env";
import { axiosInstanceWithToken } from "../config";
const URL = env.api.mrp;

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

export type ReplaceAccountPlanResponse = ImportAccountPlanResponse & {
  removedAccountsCount: number;
  removedAccounts: ImportedAccount[];
};

export type AccountClassificationStatus =
  | "Classified"
  | "PendingClassification";

export type AccountPlanAccount = {
  id: number;
  accountPlanId: number;
  costCenter: string;
  name: string;
  accountPlanClassificationId: number | null;
  accountPlanClassificationName: string | null;
  accountPlanClassificationType: string | null;
  classificationStatus: AccountClassificationStatus;
  origin: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedAccountPlanAccounts = {
  accountPlanId: number;
  name: string;
  sourceMode: string;
  totalCount: number;
  skip: number;
  take: number;
  hasPendingClassifications: boolean;
  pendingClassificationsCount: number;
  accounts: AccountPlanAccount[];
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

export const replaceAccountPlanAccounts = async (
  file: File,
  accountPlanId: number
): Promise<ReplaceAccountPlanResponse> => {
  const fileData = new FormData();
  fileData.append("file", file);

  const response = await axiosInstanceWithToken.put(
    `${URL}/api/AccountPlans/${accountPlanId}/accounts/import`,
    fileData
  );

  const responseData = response.data as
    | ApiResponse<ReplaceAccountPlanResponse>
    | ReplaceAccountPlanResponse;

  if ("data" in responseData && responseData.data) {
    return responseData.data;
  }

  return responseData as ReplaceAccountPlanResponse;
};

export const deleteAccountPlan = async (accountPlanId: number) => {
  await axiosInstanceWithToken.delete(
    `${URL}/api/AccountPlans/${accountPlanId}/accounts`
  );
};

export const getPaginatedAccountPlanAccounts = async (
  accountPlanId: number,
  skip: number,
  take: number,
  search?: string
): Promise<PaginatedAccountPlanAccounts> => {
  const response = await axiosInstanceWithToken.get<
    ApiResponse<PaginatedAccountPlanAccounts>
  >(`${URL}/api/AccountPlans/${accountPlanId}/accounts/paginated`, {
    params: {
      skip,
      take,
      ...(search ? { search } : {}),
    },
  });

  if (!response.data.data) {
    throw new Error(
      response.data.errorMessage?.[0] ||
        response.data.message ||
        "Não foi possível carregar o plano de contas."
    );
  }

  return response.data.data;
};
