import { useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { useEffect, useState } from "react";
import { getCompanies } from "../../services/apis/routes/companies.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import { CompanyTable } from "./CompanyTable";
import { Company } from "../../types/company";
import { MainContainer, Title } from "./styles";
import { DivSkeleton } from "../../styles/skeleton/skeleton";

type Companies = {
  groupName: string;
  companies: Company[];
};

export const Companies = () => {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState<Companies | null>(null);
  const { setLoading } = useLoading();
  const [, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      console.log(groupId);
      const response = await getCompanies(Number(groupId));
      const data = response.data;
      setGroupData(data);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        setError(error.message);
      } else {
        toast.error("Erro ao buscar as empresas.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (!groupData)
    return (
      <MainTemplate>
        <MainContainer>
          <DivSkeleton width="50%" height="50px"></DivSkeleton>
          <DivSkeleton width="100%" height="250px"></DivSkeleton>
        </MainContainer>
      </MainTemplate>
    );

  return (
    <MainTemplate>
      <MainContainer>
        <Title>{groupData.groupName}</Title>
        <CompanyTable companies={groupData.companies} />
      </MainContainer>
    </MainTemplate>
  );
};
