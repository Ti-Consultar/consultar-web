export type ProfileInformation = {
  id: number;
  email: string;
  name: string;
  role: string;
  contact: string;
};

export type ProfileChanges = {
  name: string;
  contact: string;
  email: string;
};
