import { env } from "../../../config/env";
import { BalancetePayload } from "../../../types/balancetePayload";
import { ClassificationBalanceteResponse } from "../../../types/balancete";
import {
  TrialBalanceViewerQuery,
  TrialBalanceViewerResponse,
} from "../../../types/trialBalanceViewer";
import { axiosInstanceWithToken } from "../config";

const URL = env.api.mrp;

type ImportAccountingWithMappingParams = {
  balanceteId: number;
  startRow?: number;
  costCenter?: number;
  name?: number;
  initialValue?: number;
  debit?: number;
  credit?: number;
  finalValue?: number;
};

export const submitAccounting = async (data: BalancetePayload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Balancete`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalancete = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrialBalanceViewerRows = async (
  trialBalanceId: number,
  params: TrialBalanceViewerQuery,
  signal?: AbortSignal,
): Promise<TrialBalanceViewerResponse> => {
  const response = await axiosInstanceWithToken.get<TrialBalanceViewerResponse>(
    `${URL}/api/v2/trial-balances/${trialBalanceId}/viewer/rows`,
    { params, signal },
  );

  return response.data;
};

export const getBalanceteByDate = async (
  accountPlanId: number,
  year: number,
  month: number
) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${accountPlanId}/date`,
      {
        params: { year, month },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFirstBalanceteByAccountPlan = async (
  accountPlanId: number
): Promise<{ success: boolean; data?: ClassificationBalanceteResponse }> => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${accountPlanId}/date`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceteData = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}/data`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceteByCostCenter = async (balanceteId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${balanceteId}/cost-center`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalancetes = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const importAccounting = async (data: File, balanceteId: number) => {
  const fileData = new FormData();
  fileData.append("file", data);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Balancete/import`,
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

export const importAccountingWithMapping = async (
  file: File,
  params: ImportAccountingWithMappingParams
) => {
  const fileData = new FormData();
  fileData.append("file", file);

  try {
    const response = await axiosInstanceWithToken.post(
      `${URL}/api/Balancete/import/dinamic`,
      fileData,
      {
        params: {
          balanceteId: params.balanceteId,
          StartRow: params.startRow,
          CostCenter: params.costCenter,
          Name: params.name,
          InitialValue: params.initialValue,
          Debit: params.debit,
          Credit: params.credit,
          FinalValue: params.finalValue,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editBalanceSheetColumns = async (data: {
  accountPlanId: number;
  startRow: number;
  costCenterCol: number;
  nameCol: number;
  initialValueCol: number;
  debitCol: number;
  creditCol: number;
  finalValueCol: number;
  createdAt?: string;
}) => {
  try {
    const response = await axiosInstanceWithToken.put(
      `${URL}/api/Balancete/update-config/balancete`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceteFiltered = async (id: number, tipo: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/${id}/filter`,
      {
        params: { tipo },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConsolidatedIncomeStatement = async (groupId: number, year: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/demonstracao-consolidado`,  
      {
        params: { groupId, year},
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBalancete = async (id: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(
      `${URL}/api/Balancete/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const hasBalanceMapping = async (accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${accountPlanId}/config/exists`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceSheetConfig = async (accountPlanId: number) => {
  try {
    const response = await axiosInstanceWithToken.get(
      `${URL}/api/Balancete/accountplan/${accountPlanId}/config/balancete`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
