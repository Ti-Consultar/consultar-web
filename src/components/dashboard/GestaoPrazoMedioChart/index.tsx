import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingProvider";
import { Box } from "@mui/material";
import { getGestaoPrazoMedio } from "../../../services/apis/routes/dashboard.service";
import { GestaoPrazoMedioCarousel } from "../../../Features/Companies/Charts/GestaoPrasoMedioCarousel";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

interface GestaoPrazoMedioDashboardProps {
  year: number | null;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onChangeIndex?: (index: number) => void;
}

export const GestaoPrazoMedioDashboard = ({
  year,
  currentIndex,
  onNext,
  onPrev,
  onChangeIndex,
}: GestaoPrazoMedioDashboardProps) => {
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

  const fetchData = async () => {
    if (!accountPlanId) return;
    if (!year) return;
    try {
      if (!accountPlanId) return;
      const response = await getGestaoPrazoMedio(year, accountPlanId);
      setData(response);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accountPlanId, year]);

  return (
    <Box>
      <GestaoPrazoMedioCarousel
        data={data}
        onPrev={onPrev}
        onNext={onNext}
        currentIndex={currentIndex}
        onChangeIndex={onChangeIndex}
      />
    </Box>
  );
};
