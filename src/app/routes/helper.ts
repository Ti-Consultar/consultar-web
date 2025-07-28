export const withScopes = (basePath: string) => [
  `/grupos/:groupId/${basePath}`,
  `/grupos/:groupId/empresas/:companyid/${basePath}`,
  `/grupos/:groupId/empresas/:companyid/filiais/:subCompanyid/${basePath}`,
];
