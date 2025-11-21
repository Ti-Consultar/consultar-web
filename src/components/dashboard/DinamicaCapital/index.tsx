import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../contexts/LoadingProvider";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import { toast } from "react-toastify";
import { getCapitalDynamics } from "../../../services/apis/routes/gestaoLiquidez.service";
import { Box } from "@mui/material";
import { CapitalDynamicsCarousel } from "../../../Features/Companies/Charts/CapitalDynamicsCarousel";

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
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const { setLoading } = useLoading();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!groupId || accountPlanId) return;

    const getAccountPlanId = async (
      groupId: number,
      companyId?: number,
      subCompanyId?: number
    ): Promise<void> => {
      try {
        setLoading(true, "Buscando...");
        const response = await getAccountPlan(groupId, companyId, subCompanyId);

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) return;

        const lastItem = data[data.length - 1];
        setAccountPlanId(lastItem.id);
      } catch (error) {
        console.error("Failed to fetch AccountPlanId", error);
        toast.error("Erro ao buscar plano de contas");
      } finally {
        setLoading(false);
      }
    };

    getAccountPlanId(
      Number(groupId),
      companyid ? Number(companyid) : undefined,
      subCompanyId ? Number(subCompanyId) : undefined
    );
  }, [groupId, companyid, subCompanyId, accountPlanId, setLoading]);

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
