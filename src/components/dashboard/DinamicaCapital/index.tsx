import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getCapitalDynamics } from "../../../services/apis/routes/gestaoLiquidez.service";
import { Box } from "@mui/material";
import { CapitalDynamicsCarousel } from "../../../Features/Companies/Charts/CapitalDynamicsCarousel";
import { useAccountPlanId } from "../../../utils/hooks/useAccountPlanId";

interface DinamicaCapitalCarouselProps {
  year: number | null;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onChangeIndex?: (index: number) => void;
}

export const DinamicaCapitalCarousel = ({
  year,
  currentIndex,
  onNext,
  onPrev,
  onChangeIndex,
}: DinamicaCapitalCarouselProps) => {
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
    try {
      if (!accountPlanId) return;
      if (!year) return;
      const response = await getCapitalDynamics(accountPlanId, year);
      setData(response.capitalDynamics?.months);
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
      <CapitalDynamicsCarousel
        data={data}
        currentIndex={currentIndex}
        onNext={onNext}
        onPrev={onPrev}
        onChangeIndex={onChangeIndex}
      />
    </Box>
  );
};
