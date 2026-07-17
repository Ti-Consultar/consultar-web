import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingProvider";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const accountPlanCache = new Map<string, { id: number; entityName: string }>();

interface Params {
  groupId?: number | string;
  companyId?: number | string;
  subCompanyId?: number | string;
}

export function useAccountPlanId({ groupId, companyId, subCompanyId }: Params) {
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [entityName, setEntityName] = useState<string>("");
  const [accountPlanContextKey, setAccountPlanContextKey] =
    useState<string>("");
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const cacheKey = `g:${groupId || 0}-c:${companyId || 0}-s:${
    subCompanyId || 0
  }`;

  useEffect(() => {
    if (!groupId) {
      setAccountPlanId(null);
      setEntityName("");
      setAccountPlanContextKey("");
      return;
    }

    const cached = accountPlanCache.get(cacheKey);
    if (cached) {
      setAccountPlanId(cached.id);
      setEntityName(cached.entityName);
      setAccountPlanContextKey(cacheKey);
      return;
    }

    setAccountPlanId(null);
    setEntityName("");
    setAccountPlanContextKey("");

    let cancelled = false;

    const fetchAccountPlanId = async () => {
      try {
        setLoading(true, "Buscando Plano de Contas...");

        const response = await getAccountPlan(
          +groupId,
          companyId ? +companyId : undefined,
          subCompanyId ? +subCompanyId : undefined
        );

        if (cancelled) return;

        if (response.status === 401) {
          toast.error("Sessão expirada. Faça login novamente.");
          navigate("/");
          return;
        }

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
        setAccountPlanContextKey(cacheKey);
      } catch (error: unknown) {
        if (cancelled) return;

        const requestError = error as { response?: { status?: number } };

        if (requestError.response?.status === 401) {
          toast.error("Sessão expirada. Faça login novamente.");
          navigate("/");
          return;
        }

        console.error("Erro ao buscar Plano de Contas:", error);
        toast.error("Erro ao buscar Plano de Contas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAccountPlanId();

    return () => {
      cancelled = true;
      setLoading(false);
    };
  }, [cacheKey, groupId, companyId, subCompanyId]);

  return { accountPlanId, entityName, accountPlanContextKey };
}
