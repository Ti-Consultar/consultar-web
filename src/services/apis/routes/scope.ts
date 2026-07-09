export type FinancialScope = {
  groupId?: number | string | null;
  companyId?: number | string | null;
  subCompanyId?: number | string | null;
};

export const buildScopeParams = (scope?: FinancialScope) => ({
  ...(scope?.groupId ? { groupId: Number(scope.groupId) } : {}),
  ...(scope?.companyId ? { companyId: Number(scope.companyId) } : {}),
  ...(scope?.subCompanyId ? { subCompanyId: Number(scope.subCompanyId) } : {}),
});

export const buildFinancialScopeParams = (
  accountPlanId: number,
  scope?: FinancialScope,
) => ({
  accountPlanId,
  ...buildScopeParams(scope),
});

