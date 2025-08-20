import { useNavigate, useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { useEffect, useState } from "react";
import {
  deleteCompany,
  getCompanies,
  getCompanyById,
  getCompanyUsers,
  getDeletedCompanies,
  restoreCompanies,
  saveCompany,
  updateCompany,
} from "../../services/apis/routes/companies.service";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "react-toastify";
import { CompanyTable } from "./CompanyTable";
import { Company } from "../../types/company";
import { MainContainer, Subtitle, Title } from "./styles";
import { DivSkeleton } from "../../styles/skeleton/skeleton";
import { getGroupById } from "../../services/apis/routes/groups.service";
import { useAuth } from "../../utils/hooks/useAuth";
import { GroupFormData } from "../../types/group";
import { Box, useMediaQuery } from "@mui/material";
import { MobileTableView } from "./CompanyTable/MobileTableView";
import { useMainContext } from "../../contexts/mainContext";
import { unlinkFromCompany } from "../../services/apis/routes/invitation.service";
import { getBreadcrumb } from "../../services/apis/routes/breadcrumb.service";
import { BreadcrumbItem } from "../../types/breadcrumb";
import { Member } from "../../types/member";
import { getUserPolicies } from "../../services/apis/routes/auth.service";
import { useCompany } from "../../contexts/CompanyProvider";
import { DashboardPanel } from "../Dashboard";
import { KpiCard } from "../../components/Card/KpiCard";
import { CompanyForm } from "../GroupForm";
import { getAccountPlan } from "../../services/apis/routes/accountplan.service";
import { getDashboardData } from "../../services/apis/routes/dashboard.service";
import { DashboardPanelData } from "../../types/dashboardPanel";
import DashboardIcon from "../../assets/icons/duo-icons_dashboard.svg";
import { DinamicaCapitalCarousel } from "../Dashboard/DinamicaCapital";
import { GestaoPrazoMedioDashboard } from "../Dashboard/GestaoPrazoMedioChart";
import { VariaveisLiquidezChart } from "../Dashboard/VariaveisLiquidezChart";

type Companies = {
  groupName: string;
  companies: Company[];
};

type RoleOption = {
  id: number;
  name: string;
};

export const Companies = () => {
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
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [dashboardPanelData, setDashboardPanelData] =
    useState<DashboardPanelData>();
  const { groupId, companyid, subCompanyId } = useParams<{
    groupId: string;
    companyid?: string;
    subCompanyId?: string;
  }>();

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

  const getDashboardPanelData = async (): Promise<void> => {
    try {
      if (!accountPlanId) return;
      setLoading(true);
      const response = await getDashboardData(2025, accountPlanId);

      const data = response;

      if (!Array.isArray(data) || data.length === 0) return;

      const lastItem = data[data.length - 1];
      setDashboardPanelData(lastItem);
    } catch (error) {
      console.error("Failed to fetch Dashboard", error);
      toast.error("Erro ao buscar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(dashboardPanelData);
  }, [dashboardPanelData]);

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

  useEffect(() => {
    if (userData && groupId) {
      fetchAllData();
      fetchDeletedCompanies();
      getDashboardPanelData();
    }
  }, [userData, groupId, accountPlanId]);

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

  const fetchCurrentUsers = async (id: number) => {
    try {
      if (!groupId) return;
      const response = await getCompanyUsers(id, Number(groupId));
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
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
              <DivSkeleton width="30%" height="120px" />
              <div style={{ display: "flex", gap: "1rem" }}>
                <DivSkeleton width="100%" height="120px" />
                <DivSkeleton width="100%" height="120px" />
                <DivSkeleton width="100%" height="120px" />
              </div>
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            gap: 0.5,
          }}
        >
          <img src={DashboardIcon}></img>
          <Title>Dashboard</Title>
        </Box>
        <Subtitle>Índices Econômicos</Subtitle>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <KpiCard
              title="Margem Bruta"
              value={dashboardPanelData?.margemBruta}
              variation={dashboardPanelData?.variacaoMargemBruta}
            />
            <KpiCard
              title="Receita Líquida"
              value={dashboardPanelData?.receitaLiquida}
              variation={dashboardPanelData?.variacaoReceitaLiquida}
            />
            <KpiCard
              title="Margem Líquida"
              value={dashboardPanelData?.margemLiquida}
              variation={dashboardPanelData?.variacaoMargemLiquida}
            />
          </Box>
          <DashboardPanel />
          <Subtitle>Gestão Prazo Médio</Subtitle>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              mb: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 300, maxWidth: "50%" }}>
              <DinamicaCapitalCarousel />
            </Box>

            <Box sx={{ flex: 1, minWidth: 300, maxWidth: "50%" }}>
              <GestaoPrazoMedioDashboard />
            </Box>
          </Box>
          <Subtitle>Gestão de Liquidez</Subtitle>
          <Box sx={{mb: 3}}>
            <VariaveisLiquidezChart />
          </Box>
        </Box>
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
            fetchCurrentUsers={fetchCurrentUsers}
          />
        )}
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
      </MainContainer>
    </MainTemplate>
  );
};
