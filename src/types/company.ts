import { BusinessEntity } from "./group";

export type Permission = {
  id: number;
  name: string;
};

export type Company = {
  groupId: number;
  id: number;
  companyId: number;
  companyName: string;
  userId: number;
  dateCreate: string;
  businessEntity: BusinessEntity;
  subCompanies: Company[];
  permission: Permission | null;
};
