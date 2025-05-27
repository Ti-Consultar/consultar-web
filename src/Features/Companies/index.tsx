import { useNavigate, useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { useEffect, useState } from "react";
import {
  deleteCompany,
  getCompanies,
  getCompanyById,
  getDeletedCompanies,
  restoreCompanies,
  saveCompany,
  updateCompany,
} from "../../services/apis/routes/companies.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import { CompanyTable } from "./CompanyTable";
import { Company } from "../../types/company";
import { HeaderContainer, MainContainer } from "./styles";
import { DivSkeleton } from "../../styles/skeleton/skeleton";
import {
  getGroupById,
  getGroupUsers,
} from "../../services/apis/routes/groups.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { InfoCard } from "./InfoCard";
import { GroupFormData } from "../../types/group";
import { formatPhoneNumberSymbolized } from "../../utils/formatters";
import { CompanyForm } from "../GroupForm";
import { useMediaQuery } from "@mui/material";
import { MobileTableView } from "./CompanyTable/MobileTableView";
import { useMainContext } from "../../contexts/mainContext";
import {
  inviteUser,
  unlinkFromCompany,
} from "../../services/apis/routes/invitation.service";
import { getBreadcrumb } from "../../services/apis/routes/breadcrumb.service";
import { BreadcrumbItem } from "../../types/breadcrumb";
import { Member } from "../../types/member";
import { getUserPolicies } from "../../services/apis/routes/auth.service";
import { invitations } from "../../types/userInvitationPayload";
import { useCompany } from "../../contexts/CompanyProvider";

type Companies = {
  groupName: string;
  companies: Company[];
};

type RoleOption = {
  id: number;
  name: string;
};

export const Companies = () => {
  const { groupId } = useParams();
  const { companyId } = useCompany();
  const [companiesData, setCompaniesData] = useState<Companies | null>(null);
  const [groupData, setGroupData] = useState<any>({} as any);
  const { setLoading } = useLoading();
  const userData = useAuth();
  const [open, setOpen] = useState(false);
  const [, setErrors] = useState<{ [key: string]: boolean }>({});
  const [, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [editingCompany, setEditingCompany] = useState<GroupFormData>();
  const [deletedCompanies, setDeletedCompanies] = useState<any[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [companyIdLocal, setCompanyId] = useState<number>();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { setBreadcrumbs } = useMainContext();
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);
  const [userPolicies, setUserPolicies] = useState<RoleOption[]>([]);

  const fetchAllData = async () => {
    try {
      const [groupResponse, companiesResponse] = await Promise.all([
        getGroupById(Number(groupId)),
        getCompanies(Number(groupId)),
      ]);

      setGroupData(groupResponse.data);
      setCompaniesData(companiesResponse.data);
    } catch (error) {
      toast.error("Erro ao buscar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (groupId) {
        const items = await getBreadcrumb({
          id: Number(groupId),
          type: "group",
        });

        const modifiedItems = items.map((item: BreadcrumbItem) => {
          let modifiedLink = item.link;

          if (item.type === "company") {
            modifiedLink = `/grupos/${item.id}/empresas`;
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

  const fetchDeletedCompanies = async () => {
    try {
      if (!userData?.userId || !groupId) return;
      const response = await getDeletedCompanies(Number(groupId));
      const formatted = response.data.companies.map((item: any) => ({
        id: item.companyId,
        nome: item.businessEntity.nomeFantasia || item.companyName,
        cnpj: item.businessEntity.cnpj,
      }));
      setDeletedCompanies(formatted);
    } catch (error) {
      console.error("Erro ao buscar empresas inativas", error);
    }
  };

  const fetchCurrentUsers = async () => {
    try {
      if (!groupId) return;
      const response = await getGroupUsers(Number(groupId));
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  useEffect(() => {
    if (userData && groupId) {
      fetchAllData();
      fetchDeletedCompanies();
      fetchCurrentUsers();
    }
  }, [userData, groupId]);

  const handleEdit = async (company: Company) => {
    try {
      setOpen(true);
      const data = await getCompanyById(company.companyId, Number(groupId));
      setCompanyId(company.companyId);
      setEditingCompany(data.data);
    } catch (error) {
      toast.error(
        "Erro ao buscar empresa para edição, entre em contato com o suporte."
      );
    }
  };

  const onSubmit = async (data: GroupFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(data.businessEntity.email);

    if (!isValidEmail) {
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    setLoading(true, "Salvando empresa...");

    try {
      const updatedData = {
        ...data,
        groupId: groupData.groupId,
        userId: Number(userData?.userId),
      };

      const response = companyIdLocal
        ? await updateCompany(updatedData, companyIdLocal)
        : await saveCompany(updatedData);

      if (
        response.success &&
        typeof response.data === "string" &&
        response.data.includes("Já existe um cadastro com este CNPJ")
      ) {
        setErrors((prev) => ({ ...prev, cnpj: true }));
        toast.warning("Já existe um cadastro com este CNPJ.");
        return;
      }

      if (!response.success) {
        setError("Um erro ocorreu ao tentar salvar o Grupo");
        return;
      }

      setError(null);
      setActiveStep(0);
      setOpen(false);
      toast.dismiss();

      setTimeout(() => {
        const message = editingCompany?.groupId
          ? "Empresa atualizada com sucesso!"
          : "Empresa criada com sucesso!";

        toast.success(message);
      }, 500);

      setEditingCompany(undefined);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Erro ao salvar os dados da empresa.");
      }
    } finally {
      setEditingCompany(undefined);
      fetchAllData();
      setLoading(false);
    }
  };

  const handleUnlinkBranch = async (company: any) => {
    try {
      setLoading(true, "Excluindo empresa...");

      const response = await unlinkFromCompany(
        Number(userData?.userId),
        Number(groupId),
        company.companyId
      );

      if (!response.success) {
        toast.error("Um erro ocorreu ao tentar excluir a empresa");
        return;
      }

      toast.success("Desvinculado com sucesso.");
      fetchAllData();
      fetchDeletedCompanies();
      setCompaniesData((prev: any) =>
        prev
          ? {
              ...prev,
              companies: prev.companies.filter(
                (c: any) => c.companyId !== company.companyId
              ),
            }
          : null
      );
    } catch (error) {
      toast.error("Erro ao excluir a empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (selectedIds: number[]) => {
    try {
      setLoading(true, "Reativando empresas...");
      await restoreCompanies(Number(groupId), selectedIds);
      const updated = deletedCompanies.filter(
        (c) => !selectedIds.includes(c.id)
      );
      setDeletedCompanies(updated);
      toast.success("Empresas reativadas com sucesso!");
      fetchDeletedCompanies();
      fetchAllData();
    } catch (error) {
      toast.error("Erro ao reativar empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (company: Company) => {
    try {
      setLoading(true, "Excluindo empresa...");

      const response = await deleteCompany(company.companyId, Number(groupId));

      if (!response.success) {
        toast.error("Um erro ocorreu ao tentar excluir a empresa");
        return;
      }

      toast.success("Empresa excluída com sucesso!");
      fetchDeletedCompanies();
      setCompaniesData((prev) =>
        prev
          ? {
              ...prev,
              companies: prev.companies.filter(
                (c) => c.companyId !== company.companyId
              ),
            }
          : null
      );
    } catch (error) {
      toast.error("Erro ao excluir a empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (companyId: number) => {
    navigate(`/grupos/${Number(groupId)}/empresas/${companyId}/filiais`);
  };

  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        const response = await getUserPolicies();
        setUserPolicies(response.data);
        setHasFetched(true);
      } catch (error) {
        console.error("Erro ao buscar políticas:", error);
      }
    };

    fetchUserPolicies();
  }, [hasFetched]);

  if (!companiesData) {
    return (
      <MainTemplate>
        <MainContainer>
          {isMobile ? (
            <>
              <DivSkeleton width="100%" height="100px" />
              <DivSkeleton width="100%" height="600px" />
            </>
          ) : (
            <>
              <DivSkeleton width="100%" height="120px" />
              <DivSkeleton width="100%" height="400px" />
            </>
          )}
        </MainContainer>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <MainContainer>
        <HeaderContainer>
          <CompanyForm
            onSubmit={onSubmit}
            isOpen={open}
            onClose={() => {
              setOpen(false);
              setEditingCompany(undefined);
            }}
            title="Adicionar empresa"
            defaultValues={editingCompany}
            externalActiveStep={activeStep}
          />
          <InfoCard
            title={companiesData.groupName}
            email={groupData.businessEntity.email}
            phones={formatPhoneNumberSymbolized(
              groupData.businessEntity.telefone
            )}
          />
        </HeaderContainer>
        {isMobile ? (
          <MobileTableView
            companies={companiesData.companies}
            onAddClick={() => setOpen(true)}
            onAddCompany={() => setOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDeleteCompany}
            onReactivate={handleReactivate}
            fileName={groupData.businessEntity.razaoSocial}
            onRowClick={handleRowClick}
          ></MobileTableView>
        ) : (
          <CompanyTable
            onRowClick={handleRowClick}
            onUnlink={handleUnlinkBranch}
            deletedCompanies={deletedCompanies}
            onDelete={handleDeleteCompany}
            onEdit={handleEdit}
            onOpen={() => {}}
            fileName={groupData.businessEntity.razaoSocial}
            companies={companiesData.companies}
            onReactivate={handleReactivate}
            onAddCompany={() => setOpen(true)}
            members={members}
            userPolicies={userPolicies}
          />
        )}
      </MainContainer>
    </MainTemplate>
  );
};
