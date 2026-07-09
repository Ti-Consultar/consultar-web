import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { MarginCarousel } from "../../../Features/Companies/Charts";
import { Box } from "@mui/material";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getProfitability } from "../../../services/apis/routes/economicIndices.service";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

interface MarginsChartsProps {
  year: number | null;
}

export const MarginsCharts = ({ year }: MarginsChartsProps) => {
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
    try {
      if (!accountPlanId) return;
      if (!year) return;
      const response = await getProfitability(accountPlanId, year, financialScope);
      setData(response.profitability?.months);
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
      <Box sx={{ width: "100%", mb: "1rem" }}>
        <MarginCarousel data={data} />
      </Box>
    </Box>
  );
};
