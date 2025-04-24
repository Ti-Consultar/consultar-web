import { BusinessEntity } from "./group";

export type Permission = {
  id: number;
  name: string;
};

export type Company = {
  companyId: number;
  companyName: string;
  dateCreate: string;
  businessEntity: BusinessEntity;
  subCompanies: Company[];
  permission: Permission | null;
};
