import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLoading } from "../../contexts/LoadingProvider";
import { useYear } from "../../contexts/YearContext";
import {
  getDashboardData,
  getDashboardLatestPeriod,
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
  const { setYear } = useYear();
  const currentYearRef = useRef(year);

  const [panel, setPanel] = useState<DashboardPanelData | null>(null);
  const [liquidity, setLiquidity] = useState<any[]>([]);
  const [prazoMedio, setPrazoMedio] = useState<any[]>([]);
  const [dinamica, setDinamica] = useState<any[]>([]);
  const [margins, setMargins] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [initializedAccountPlanId, setInitializedAccountPlanId] = useState<
    number | null
  >(null);
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyId,
    subCompanyId: subCompanyId,
  });

  // === CARROSSEL ===
  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  currentYearRef.current = year;

  useEffect(() => {
    let cancelled = false;

    setInitializedAccountPlanId(null);

    async function initializePeriod() {
      if (!accountPlanId) return;

      let initialYear = currentYearRef.current;

      try {
        const latestPeriod = await getDashboardLatestPeriod(accountPlanId);

        if (Number.isInteger(latestPeriod.year)) {
          initialYear = latestPeriod.year;
        }
      } catch (error) {
        console.error("Erro ao carregar o último período do dashboard", error);
      }

      if (cancelled) return;

      setYear(initialYear);
      setInitializedAccountPlanId(accountPlanId);
    }

    initializePeriod();

    return () => {
      cancelled = true;
    };
  }, [accountPlanId, setYear]);

  // === FETCH DAS MÉTRICAS ===
  useEffect(() => {
    async function load() {
      if (!accountPlanId || initializedAccountPlanId !== accountPlanId) return;
      try {
        setLoading(true, "Carregando dados do dashboard...");

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
  }, [accountPlanId, initializedAccountPlanId, year]);

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
