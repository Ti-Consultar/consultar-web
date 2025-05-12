import { BusinessEntity } from "./group";

export type SubCompanyEntity = {
  businessEntity: BusinessEntity;
  companyId: number;
  userId: number;
  id: number;
  name: string;
};

export type SubCompany = {
  totalCount: number;
  skip: number;
  take: number;
  subCompanies: SubCompanyEntity[];
};
