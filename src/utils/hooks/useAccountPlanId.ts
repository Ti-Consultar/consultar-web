import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingProvider";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { toast } from "sonner";

const accountPlanCache = new Map<string, { id: number; entityName: string }>();

interface Params {
  groupId?: number | string;
  companyId?: number | string;
  subCompanyId?: number | string;
}

export function useAccountPlanId({ groupId, companyId, subCompanyId }: Params) {
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [entityName, setEntityName] = useState<string>("");
  const { setLoading } = useLoading();

  const cacheKey = `g:${groupId || 0}-c:${companyId || 0}-s:${
    subCompanyId || 0
  }`;

  useEffect(() => {
    if (!groupId) return;

    const cached = accountPlanCache.get(cacheKey);
    if (cached) {
      setAccountPlanId(cached.id);
      setEntityName(cached.entityName);
      return;
    }

    const fetchAccountPlanId = async () => {
      try {
        setLoading(true, "Buscando Plano de Contas...");

        const response = await getAccountPlan(
          +groupId,
          companyId ? +companyId : undefined,
          subCompanyId ? +subCompanyId : undefined
        );

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const last = data[data.length - 1];
        const value = {
          id: last.id,
          entityName: last.entityName || "",
        };

        accountPlanCache.set(cacheKey, value);

        setAccountPlanId(value.id);
        setEntityName(value.entityName);
      } catch (error) {
        console.error("Erro ao buscar Plano de Contas:", error);
        toast.error("Erro ao buscar Plano de Contas.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountPlanId();
  }, [cacheKey, groupId, companyId, subCompanyId]);

  return { accountPlanId, entityName };
}
