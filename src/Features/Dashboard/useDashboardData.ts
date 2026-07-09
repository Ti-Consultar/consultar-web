import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLoading } from "../../contexts/LoadingProvider";
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
import { useAccountPlanId } from "../../utils/hooks/useAccountPlanId";

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

  const [panel, setPanel] = useState<DashboardPanelData | null>(null);
  const [liquidity, setLiquidity] = useState<any[]>([]);
  const [prazoMedio, setPrazoMedio] = useState<any[]>([]);
  const [dinamica, setDinamica] = useState<any[]>([]);
  const [margins, setMargins] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyId,
    subCompanyId: subCompanyId,
  });
  const financialScope = {
    groupId,
    companyId,
    subCompanyId,
  };

  // === CARROSSEL ===
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // === FETCH DAS MÉTRICAS ===
  useEffect(() => {
    async function load() {
      if (!accountPlanId) return;
      try {
        setLoading(true, "Carregando dados do dashboard...");

        const [panelResp, lp, prazo, din, marg] = await Promise.all([
          getDashboardData(year, accountPlanId, financialScope),
          getLiquidityManagement(accountPlanId, year, financialScope),
          getGestaoPrazoMedio(year, accountPlanId, financialScope),
          getCapitalDynamics(accountPlanId, year, financialScope),
          getProfitability(accountPlanId, year, financialScope),
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
  }, [accountPlanId, year, groupId, companyId, subCompanyId]);

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
