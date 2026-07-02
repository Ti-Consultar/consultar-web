import { env } from "../../../config/env";
import { BalancetePayload } from "../../../types/balancetePayload";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

type FinancialScope = {
  groupId?: number | string;
  companyId?: number | string;
  subCompanyId?: number | string;
};

const buildScopeParams = (scope?: FinancialScope) => ({
  ...(scope?.groupId ? { groupId: Number(scope.groupId) } : {}),
  ...(scope?.companyId ? { companyId: Number(scope.companyId) } : {}),
  ...(scope?.subCompanyId ? { subCompanyId: Number(scope.subCompanyId) } : {}),
});

export const submitBudget = async (data: BalancetePayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Budget`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBudget = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Budget/${balanceteId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBudgets = async (id: number, scope?: FinancialScope) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Budget/accountplan/${id}`,
      { params: buildScopeParams(scope) }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importBudgetSheet = async (data: File, balanceteId: number) => {
  const fileData = new FormData();
  fileData.append("file", data);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Budget/import`,
      fileData,
      {
        params: { balanceteId },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBudget = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(
      `${URL}/api/Budget/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
