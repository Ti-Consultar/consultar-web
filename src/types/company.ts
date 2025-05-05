import { BusinessEntity } from "./group";

export type Permission = {
  id: number;
  name: string;
};

export type Company = {
  groupId: number;
  companyId: number;
  companyName: string;
  userId: number;
  dateCreate: string;
  businessEntity: BusinessEntity;
  subCompanies: Company[];
  permission: Permission | null;
};
