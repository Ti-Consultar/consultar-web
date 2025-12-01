export interface Permission {
  id: number;
  name: string;
}

export interface CompanyNode {
  id: number;
  name: string;
  accountPlanId: number;
  permission: Permission;
  subCompanies: CompanyNode[]; 
}

export interface GroupData {
  id: number;
  name: string;
  accountPlanId: number;
  permission: Permission;
  filiais: CompanyNode[];
}

export interface CompanyResponse {
  data: GroupData;
  success: boolean;
  message: string;
  time: string;
  environment: string;
  router: string;
  tokenValidTotalMinutesTo: number;
  errorMessage: any[];
}
