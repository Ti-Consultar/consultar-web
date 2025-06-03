export type Business = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type Permission = {
  id: number;
  name: string;
};

export type Invite = {
  id: number;
  group: Business;
  company: Business;
  subCompany: Business;
  user: User;
  invitedByUser: User;
  permission: Permission;
  status: string;
  createdAt: string;
  updatedAt: string;
};
