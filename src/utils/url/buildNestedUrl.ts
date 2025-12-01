type Params = {
  groupId?: string | number;
  companyId?: string | number;
  subCompanyId?: string | number;
};

export const buildNestedUrl = (
  { groupId, companyId, subCompanyId }: Params,
  finalPath: string
): string | null => {
  const path = location.pathname;
  const parts = path.split("/").filter(Boolean);

  const currentGroupId = groupId || parts[parts.indexOf("grupos") + 1];
  const currentCompanyId =
    companyId ||
    (parts.includes("empresas")
      ? parts[parts.indexOf("empresas") + 1]
      : undefined);
  const currentSubCompanyId =
    subCompanyId ||
    (parts.includes("filiais")
      ? parts[parts.indexOf("filiais") + 1]
      : undefined);

  if (!currentGroupId) return null;

  // Dashboard -> sempre vai pro nível da empresa
  if (finalPath === "empresas" || finalPath === "dashboard") {
    if (currentCompanyId) {
      return `/grupos/${currentGroupId}/empresas/${currentCompanyId}/filiais`;
    }
    return `/grupos/${currentGroupId}/empresas`;
  }

  // Lógica padrão
  const isInGroupOnly = !currentCompanyId && !currentSubCompanyId;
  const isInCompany = !!currentCompanyId && !currentSubCompanyId;
  const isInFilial = !!currentSubCompanyId;

  let base = `/grupos/${currentGroupId}`;

  if (isInGroupOnly) {
    // grupo → não inclui /empresas
  } else if (isInCompany) {
    base += `/empresas/${currentCompanyId}`;
  } else if (isInFilial) {
    base += `/empresas/${currentCompanyId}/filiais/${currentSubCompanyId}`;
  }

  return `${base}/${String(finalPath).replace(/^\/+/, "")}`;
};
