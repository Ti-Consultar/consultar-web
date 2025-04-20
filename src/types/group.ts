export type BusinessEntity = {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
};

export type GroupFormData = {
  name: string;
  userId: number;
  groupId?: number;
  businessEntity: BusinessEntity;
}
