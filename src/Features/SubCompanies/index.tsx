import { useParams } from "react-router";
import { MainTemplate } from "../../components/AppLayout";
import { useLoading } from "../../contexts/LoadingProvider";
import { getSubCompanyById } from "../../services/apis/routes/subcompanies.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { InfoCard } from "../Companies/InfoCard";
import { MainContainer } from "../Companies/styles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBreadcrumb } from "../../services/apis/routes/breadcrumb.service";
import { BreadcrumbItem } from "../../types/breadcrumb";
import { useMainContext } from "../../contexts/mainContext";

export const SubCompanies = () => {
  const userData = useAuth();
  const { setLoading } = useLoading();
  const { groupId, companyId, subCompanyId } = useParams();
  const [groupData, setGroupData] = useState<any>({} as any);
  const { setBreadcrumbs } = useMainContext();

  useEffect(() => {
    const fetch = async () => {
      if (subCompanyId) {
        const items = await getBreadcrumb({
          id: Number(subCompanyId),
          type: "subcompany",
        });

        const modifiedItems = items.map((item: BreadcrumbItem) => {
          let modifiedLink = item.link;

          if (item.type === "group") {
            modifiedLink = `/grupos/${item.id}/empresas`; 
          } else if (item.type === "company") {
            modifiedLink = `/grupos/${groupId}/empresas/${companyId}/filiais`;
          }

          return {
            ...item,
            link: modifiedLink,
          };
        });

        setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...modifiedItems]);
      }
    };

    fetch();
  }, [companyId]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!companyId || !subCompanyId || !userData?.userId) return;

      setLoading(true, "Carregando filial...");
      try {
        const response = await getSubCompanyById(
          +subCompanyId,
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
          title={groupData.businessEntity?.razaoSocial}
          email={groupData.businessEntity?.email}
          phones={groupData.businessEntity?.telefone}
        />
      </MainContainer>
    </MainTemplate>
  );
};
