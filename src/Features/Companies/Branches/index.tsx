import { DivSkeleton } from "../../../styles/skeleton/skeleton";
import { MainTemplate } from "../../../components/AppLayout";
import { CompanyForm } from "../../GroupForm";
import { InfoCard } from "../InfoCard";
import { HeaderContainer, MainContainer } from "../styles";
import {
  deleteSubCompany,
  getBranches,
  getDeletedSubCompanies,
  getSubCompanyById,
  restoreSubCompanies,
  saveSubCompany,
  updateSubCompany,
} from "../../../services/apis/routes/subcompanies.service";
import { useAuth } from "../../../utils/hooks/useAuth";
import { useNavigate, useParams } from "react-router";
import { getCompanyById } from "../../../services/apis/routes/companies.service";
import { MobileTableView } from "../CompanyTable/MobileTableView";
import { useLoading } from "../../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";
import { useMainContext } from "../../../contexts/mainContext";
import { CompanyTable } from "../CompanyTable";
import { useEffect, useState } from "react";
import { GroupFormData } from "../../../types/group";
import { SubCompanyEntity } from "../../../types/subCompany";
import { unlinkFromCompany } from "../../../services/apis/routes/invitation.service";
import { getBreadcrumb } from "../../../services/apis/routes/breadcrumb.service";
import { BreadcrumbItem } from "../../../types/breadcrumb";
import { Member } from "../../../types/member";
import { getGroupUsers } from "../../../services/apis/routes/groups.service";
import { getUserPolicies } from "../../../services/apis/routes/auth.service";

type RoleOption = {
  id: number;
  name: string;
};

export const Branches = () => {
  const userData = useAuth();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { setLoading } = useLoading();
  const { groupId, companyId } = useParams();
  const [subCompanies, setSubCompanies] = useState<any>({} as any);
  const [, setErrors] = useState<{ [key: string]: boolean }>({});
  const [company, setCompany] = useState<any>({} as any);
  const { setBreadcrumbs } = useMainContext();
  const [editingCompany, setEditingCompany] = useState<GroupFormData>();
  const [, setActiveStep] = useState(0);
  const [subCompanyId, setSubCompanyId] = useState<number>(0);
  const [deletedSubCompanies, setDeletedSubCompanies] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [userPolicies, setUserPolicies] = useState<RoleOption[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [companyResponse, subCompaniesResponse] = await Promise.all([
        getCompanyById(Number(companyId), Number(groupId)),
        getBranches(Number(companyId)),
      ]);

      setCompany(companyResponse.data);
      setSubCompanies(subCompaniesResponse.data);
    } catch (error) {
      toast.error("Erro ao buscar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUsers = async () => {
    try {
      if (!groupId) return;
      const response = await getGroupUsers(Number(groupId));
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar empresas inativas", error);
    }
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
    fetchCurrentUsers();
  }, [hasFetched]);

  const fetchDeletedCompanies = async (skip: number, take: number) => {
    try {
      if (!userData?.userId || !groupId) return;

      const response = await getDeletedSubCompanies(
        Number(companyId),
        skip,
        take
      );

      const subCompanies = response?.data?.subCompanies ?? [];

      if (!Array.isArray(subCompanies)) {
        toast.error("Resposta inválida da API ao buscar empresas inativas.");
        return;
      }

      if (subCompanies.length === 0) {
        setDeletedSubCompanies([]);
        return;
      }

      const formatted = subCompanies.map((item: any) => ({
        id: item.subCompanyId,
        nome: item.businessEntity?.nomeFantasia || item.companyName,
        cnpj: item.businessEntity?.cnpj,
      }));

      setDeletedSubCompanies(formatted);
    } catch (error) {
      console.error("Erro ao buscar empresas inativas:", error);
      toast.error("Erro técnico ao buscar empresas inativas.");
    }
  };

  const handleEdit = async (company: SubCompanyEntity) => {
    try {
      setOpen(true);
      const data = await getSubCompanyById(company.id, company.companyId);
      setSubCompanyId(company.id);
      setEditingCompany(data.data);
    } catch (error) {
      toast.error("Erro ao buscar grupo para edição.");
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
        companyId: Number(companyId),
      };

      const response = subCompanyId
        ? await updateSubCompany(updatedData, subCompanyId)
        : await saveSubCompany(updatedData);

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
        toast.error("Um erro ocorreu ao tentar salvar a filial");
        return;
      }

      setActiveStep(0);
      setOpen(false);
      toast.dismiss();

      setTimeout(() => {
        const message = editingCompany?.groupId
          ? "Filial atualizada com sucesso!"
          : "Filial criada com sucesso!";

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

  useEffect(() => {
    const fetch = async () => {
      if (groupId) {
        const items = await getBreadcrumb({
          id: Number(companyId),
          type: "company",
        });

        const modifiedItems = items.map((item: BreadcrumbItem) => {
          let modifiedLink = item.link;

          if (item.type === "group") {
            modifiedLink = `/grupos/${groupId}/empresas/`;
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
    if (userData && companyId) {
      fetchAllData();
      fetchDeletedCompanies(0, 50);
    }
  }, [userData, companyId]);

  const handleDeleteBranch = async (subCompany: any) => {
    try {
      setLoading(true, "Excluindo empresa...");

      const response = await deleteSubCompany(subCompany.id, Number(companyId));

      if (!response.success) {
        toast.error("Um erro ocorreu ao tentar excluir a empresa");
        return;
      }

      toast.success("Empresa excluída com sucesso!");
      fetchAllData();
      fetchDeletedCompanies(0, 50);
      setSubCompanies((prev: any) =>
        prev
          ? {
              ...prev,
              subCompanies: prev.subCompanies.filter(
                (c: any) => c.id !== subCompany.id
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

  const handleUnlinkBranch = async (subCompany: any) => {
    try {
      setLoading(true, "Excluindo empresa...");

      const response = await unlinkFromCompany(
        Number(userData?.userId),
        Number(groupId),
        Number(companyId),
        subCompany.id
      );

      if (!response.success) {
        toast.error("Um erro ocorreu ao tentar excluir a empresa");
        return;
      }

      toast.success("Desvinculado com sucesso.");
      fetchAllData();
      fetchDeletedCompanies(0, 50);
      setSubCompanies((prev: any) =>
        prev
          ? {
              ...prev,
              subCompanies: prev.subCompanies.filter(
                (c: any) => c.id !== subCompany.id
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
      await restoreSubCompanies(Number(companyId), selectedIds);
      const updated = deletedSubCompanies.filter(
        (c) => !selectedIds.includes(c.subCompanyId)
      );
      setDeletedSubCompanies(updated);
      toast.success("Empresas reativadas com sucesso!");
      fetchDeletedCompanies(0, 50);
      fetchAllData();
    } catch (error) {
      toast.error("Erro ao reativar empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/grupos/${Number(groupId)}/empresas/${companyId}/filiais/${id}`);
  };

  if (!subCompanies) {
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
          />
          <InfoCard
            title={company.name}
            email={company.businessEntity?.email}
            phones={company.businessEntity?.telefone}
          />
        </HeaderContainer>
        {isMobile ? (
          <MobileTableView
            companies={subCompanies.subCompanies}
            onAddClick={() => setOpen(true)}
            onAddCompany={() => setOpen(true)}
            onEdit={handleEdit}
            onDelete={handleDeleteBranch}
            onReactivate={handleReactivate}
            fileName={company.name}
            onRowClick={handleRowClick}
          ></MobileTableView>
        ) : (
          <CompanyTable
            onRowClick={handleRowClick}
            members={members}
            onUnlink={handleUnlinkBranch}
            companies={subCompanies.subCompanies}
            deletedCompanies={deletedSubCompanies}
            companyType="Filiais"
            onEdit={handleEdit}
            onOpen={() => setOpen(true)}
            fileName={company.name}
            onDelete={handleDeleteBranch}
            onReactivate={handleReactivate}
            onAddCompany={() => setOpen(true)}
            userPolicies={userPolicies}
          />
        )}
      </MainContainer>
    </MainTemplate>
  );
};
