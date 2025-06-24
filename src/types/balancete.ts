export type AccountPlans = {
  id: number;
  group: number;
  company: number;
  subCompany: number;
};

type Entity = {
  id: number;
  name: string;
};

export type AccountPlan = {
  id: number;
  group: Entity;
  company: Entity;
  subCompany: Entity;
};

export type Balancete = {
  id: number;
  dateMonth: string;
  dateYear: number;
  status: number;
  dateCreate: string;
  accountPlan: AccountPlan;
};

export type Balancetes = {
  id: number;
  balancetes: Balancete[];
};

export type BalanceteData = {
  id: number;
  costCenter: string;
  name: string;
  initialValue: number;
  credit: number;
  debit: number;
  finalValue: number;
  budgetedAmount: boolean;
};