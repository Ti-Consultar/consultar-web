import { useParams } from "react-router";
import { MainTemplate } from "../../components/AppLayout";
import { useLoading } from "../../contexts/LoadingProvider";
import { getSubCompanyById } from "../../services/apis/routes/subcompanies.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { InfoCard } from "../Companies/InfoCard";
import { MainContainer } from "../Companies/styles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const SubCompanies = () => {
  const userData = useAuth();
  const { setLoading } = useLoading();
  const { companyId, subCompanyId } = useParams();
  const [groupData, setGroupData] = useState<any>({} as any);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!companyId || !subCompanyId || !userData?.userId) return;

      setLoading(true, "Carregando grupos empresariais...");
      try {
        const response = await getSubCompanyById(
          +subCompanyId,
          +userData.userId,
          +companyId
        );
        setGroupData(response.data);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          toast.error(error.message);
        } else {
          toast.error("Erro ao buscar os grupos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [companyId, subCompanyId, userData?.userId]);

  return (
    <MainTemplate>
      <MainContainer>
        <InfoCard
          title={
            groupData.businessEntity?.razaoSocial
          }
          email={groupData.businessEntity?.email}
          phones={groupData.businessEntity?.telefone}
        />
      </MainContainer>
    </MainTemplate>
  );
};
