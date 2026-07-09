import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingProvider";
import { Box } from "@mui/material";
import { LiquidityChart } from "../../../Features/Companies/Charts/VariaveisLiquidez";
import { getLiquidityManagement } from "../../../services/apis/routes/gestaoLiquidez.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

interface VariaveisLiquidezChartProps {
  year: number | null;
}

export const VariaveisLiquidezChart = ({year}: VariaveisLiquidezChartProps) => {
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();
  const { setLoading } = useLoading();
  const [data, setData] = useState<any[]>([]);
  const { accountPlanId } = useAccountPlanId({
    groupId,
    companyId: companyid,
    subCompanyId: subCompanyId,
  });
  const financialScope = {
    groupId,
    companyId: companyid,
    subCompanyId,
  };

  const fetchData = async () => {
    if (!accountPlanId) return;
    if (!year) return;
    try {
      if (!accountPlanId) return;
      const response = await getLiquidityManagement(
        accountPlanId,
        year,
        financialScope,
      );
      setData(response.liquidityVariables?.months);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accountPlanId, year, groupId, companyid, subCompanyId]);

  return (
    <Box>
      <LiquidityChart data={data} />
    </Box>
  );
};
