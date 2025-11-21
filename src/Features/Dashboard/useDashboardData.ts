import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoading } from "../../contexts/LoadingProvider";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import {
  getDashboardData,
  getGestaoPrazoMedio,
} from "../../services/apis/routes/dashboard.service";
import {
  getCapitalDynamics,
  getLiquidityManagement,
} from "../../services/apis/routes/gestaoLiquidez.service";
import { getProfitability } from "../../services/apis/routes/economicIndices.service";
import { DashboardPanelData } from "../../types/dashboardPanel";

interface useDashboardDataProps {
  groupId?: string;
  companyId?: string;
  subCompanyId?: string;
  year: number;
}

export function useDashboardData({
  groupId,
  companyId,
  subCompanyId,
  year,
}: useDashboardDataProps) {
  const { setLoading } = useLoading();
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);

  const [panel, setPanel] = useState<DashboardPanelData | null>(null);
  const [liquidity, setLiquidity] = useState<any[]>([]);
  const [prazoMedio, setPrazoMedio] = useState<any[]>([]);
  const [dinamica, setDinamica] = useState<any[]>([]);
  const [margins, setMargins] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  // === CARROSSEL ===
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // === PEGAR ACCOUNT PLAN ID ===
  useEffect(() => {
    if (!groupId) return;

    async function fetchPlan() {
      try {
        setLoading(true);
        const response = await getAccountPlan(
          Number(groupId),
          companyId ? Number(companyId) : undefined,
          subCompanyId ? Number(subCompanyId) : undefined
        );

        const data = response.data;
        if (Array.isArray(data) && data.length > 0)
          setAccountPlanId(data[data.length - 1].id);
      } catch (e) {
        toast.error("Erro ao carregar Plano de Contas");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [groupId, companyId, subCompanyId]);

  // === FETCH DAS MÉTRICAS ===
  useEffect(() => {
    async function load() {
      if (!accountPlanId) return;
      try {
        setLoading(true);

        const [panelResp, lp, prazo, din, marg] = await Promise.all([
          getDashboardData(year, accountPlanId),
          getLiquidityManagement(accountPlanId, year),
          getGestaoPrazoMedio(year, accountPlanId),
          getCapitalDynamics(accountPlanId, year),
          getProfitability(accountPlanId, year),
        ]);

        if (Array.isArray(panelResp)) setPanel(panelResp[panelResp.length - 1]);

        setLiquidity(lp.liquidityVariables?.months ?? []);
        setPrazoMedio(prazo);
        setDinamica(din.capitalDynamics?.months ?? []);
        setMargins(marg.profitability?.months ?? []);
      } catch {
        toast.error("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [accountPlanId, year]);

  return {
    accountPlanId,
    panel,
    liquidity,
    prazoMedio,
    dinamica,
    margins,
    index,
    next,
    prev,
    setIndex,
  };
}
