import { DivSkeleton } from "../../../styles/skeleton/skeleton";
import { MainTemplate } from "../../../components/AppLayout";
import { CompanyForm } from "../../GroupForm";
import { MainContainer } from "../styles";
import {
  deleteSubCompany,
  getBranches,
  getDeletedSubCompanies,
  getSubCompanyById,
  getSubCompanyUsers,
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
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useMainContext } from "../../../contexts/mainContext";
import { CompanyTable } from "../CompanyTable";
import { useEffect, useState } from "react";
import { GroupFormData } from "../../../types/group";
import { SubCompanyEntity } from "../../../types/subCompany";
import { unlinkFromCompany } from "../../../services/apis/routes/invitation.service";
import { getBreadcrumb } from "../../../services/apis/routes/breadcrumb.service";
import { BreadcrumbItem } from "../../../types/breadcrumb";
import { Member } from "../../../types/member";
import { getUserPolicies } from "../../../services/apis/routes/auth.service";
import { getAccountPlan } from "../../../services/apis/routes/accountplan.service";
import {
  getDashboardData,
  getGestaoPrazoMedio,
} from "../../../services/apis/routes/dashboard.service";
import { DashboardPanelData } from "../../../types/dashboardPanel";
import { KpiCard } from "../../../components/Card/KpiCard";
import { Title, Subtitle } from "../../Companies/styles";
import DashboardIcon from "../../../assets/icons/duo-icons_dashboard.svg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GestaoPrazoMedioCarousel } from "../Charts/GestaoPrasoMedioCarousel";
import { CapitalDynamicsCarousel } from "../Charts/CapitalDynamicsCarousel";
import {
  getCapitalDynamics,
  getLiquidityManagement,
} from "../../../services/apis/routes/gestaoLiquidez.service";
import { LiquidityChart } from "../Charts/VariaveisLiquidez";
import { MarginCarousel } from "../Charts";
import { getProfitability } from "../../../services/apis/routes/economicIndices,service";

type RoleOption = {
  id: number;
  name: string;
};

export const Branches = () => {
  const userData = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
  const [gestaoPrazoMedioData, setGestaoPrazoMedioData] = useState<any[]>([]);
  const [dinamicaCapitalData, setDinamicaCapitalData] = useState<any[]>([]);
  const [gestaoLiquidezData, setGestaoLiquidezData] = useState<any[]>([]);
  const [marginsData, setMarginsData] = useState<any[]>([]);
  const navigate = useNavigate();

  // === DASHBOARD STATES ===
  const [accountPlanId, setAccountPlanId] = useState<number | null>(null);
  const [dashboardPanelData, setDashboardPanelData] =
    useState<DashboardPanelData>();
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear()
  );
  const [index, setIndex] = useState(0);
  const handleNext = () => setIndex((prev) => prev + 1);
  const handlePrev = () => setIndex((prev) => prev - 1);

  if (!groupId || !companyId) return null;

  useEffect(() => {
    // evita rodar sem groupId ou companyId
    if (!groupId || !companyId) return;

    let didFetch = false;

    const fetchAccountPlanId = async (): Promise<void> => {
      if (didFetch || accountPlanId) return;
      didFetch = true;

      try {
        setLoading(true, "Buscando...");
        const response = await getAccountPlan(
          Number(groupId),
          Number(companyId)
        );

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

    fetchAccountPlanId();

    // cleanup para evitar chamadas duplas no StrictMode
    return () => {
      didFetch = true;
    };
  }, [groupId, companyId, subCompanyId]);

  // === FETCH FUNCTIONS ===
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

      const formatted = subCompanies.map((item: any) => ({
        id: item.subCompanyId,
        nome: item.businessEntity?.nomeFantasia || item.companyName,
        cnpj: item.businessEntity?.cnpj,
      }));

      setDeletedSubCompanies(formatted);
    } catch {
      toast.error("Erro técnico ao buscar empresas inativas.");
    }
  };

  const handleEdit = async (company: SubCompanyEntity) => {
    try {
      setOpen(true);
      const data = await getSubCompanyById(company.id, company.companyId);
      setSubCompanyId(company.id);
      setEditingCompany(data.data);
    } catch {
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

      toast.success(
        editingCompany?.groupId
          ? "Filial atualizada com sucesso!"
          : "Filial criada com sucesso!"
      );
      setEditingCompany(undefined);
    } catch {
      toast.error("Erro ao salvar os dados da empresa.");
    } finally {
      fetchAllData();
      setLoading(false);
    }
  };

  if (!groupId || !companyId) {
    console.log("Aguardando params...", { groupId, companyId });
    return null; // impede render e evita chamadas precoces
  }

  const getDashboardPanelData = async (): Promise<void> => {
    try {
      if (!accountPlanId) return;
      setLoading(true);
      const response = await getDashboardData(selectedYear!, accountPlanId);
      const data = response;

      if (!Array.isArray(data) || data.length === 0) return;
      const lastItem = data[data.length - 1];
      setDashboardPanelData(lastItem);
    } catch {
      console.error("Erro ao buscar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchGestaoLiquidez = async () => {
    if (!accountPlanId) return;
    if (!selectedYear) return;
    try {
      if (!accountPlanId) return;
      const response = await getLiquidityManagement(
        accountPlanId,
        selectedYear
      );
      setGestaoLiquidezData(response.liquidityVariables?.months);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMargins = async () => {
    if (!accountPlanId) return;
    try {
      if (!accountPlanId) return;
      if (!selectedYear) return;
      const response = await getProfitability(accountPlanId, selectedYear);
      setMarginsData(response.profitability?.months);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGestaoPrazoMedio = async () => {
    if (!accountPlanId) return;
    if (!selectedYear) return;
    try {
      if (!accountPlanId) return;
      const response = await getGestaoPrazoMedio(selectedYear, accountPlanId);
      setGestaoPrazoMedioData(response);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDinamicaCapital = async () => {
    if (!accountPlanId) return;
    try {
      if (!accountPlanId) return;
      if (!selectedYear) return;
      const response = await getCapitalDynamics(accountPlanId, selectedYear);
      setDinamicaCapitalData(response.capitalDynamics?.months);
    } catch (error) {
      console.error("Erro ao buscar dados ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && companyId) {
      fetchAllData();
      fetchDeletedCompanies(0, 50);
      getDashboardPanelData();
      fetchGestaoPrazoMedio();
      fetchDinamicaCapital();
      fetchMargins();
      fetchGestaoLiquidez();
    }
  }, [userData, companyId, accountPlanId, selectedYear]);

  // === BREADCRUMB ===
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

          return { ...item, link: modifiedLink };
        });

        setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...modifiedItems]);
      }
    };

    fetch();
  }, [companyId]);

  // === HANDLERS ===
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
    } catch {
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
    } catch {
      toast.error("Erro ao excluir a empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (selectedIds: number[]) => {
    try {
      setLoading(true, "Reativando empresas...");
      await restoreSubCompanies(Number(companyId), selectedIds);
      toast.success("Empresas reativadas com sucesso!");
      fetchDeletedCompanies(0, 50);
      fetchAllData();
    } catch {
      toast.error("Erro ao reativar empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/grupos/${Number(groupId)}/empresas/${companyId}/filiais/${id}`);
  };

  const fetchCurrentUsers = async (id: number) => {
    try {
      if (!groupId) return;
      const response = await getSubCompanyUsers(
        id,
        Number(groupId),
        Number(companyId)
      );
      setMembers(response.data);
    } catch {
      console.error("Erro ao buscar usuários");
    }
  };

  // === LOADING STATE ===
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
              <Box sx={{ width: "100%", height: "90px" }}></Box>
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

  // === MAIN RETURN ===
  return (
    <MainTemplate>
      <MainContainer>
        {/* DASHBOARD HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 0.5 }}>
            <img src={DashboardIcon} alt="Dashboard" />
            <Title>Dashboard</Title>
          </Box>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year"]}
                label="Selecione a data"
                value={selectedYear ? dayjs().year(selectedYear) : null}
                onChange={(newValue) =>
                  setSelectedYear(newValue ? newValue.year() : null)
                }
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        {/* DASHBOARD CARDS */}
        <Subtitle>Índices Econômicos</Subtitle>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <KpiCard
              title="Receita Líquida"
              value={dashboardPanelData?.receitaLiquida}
              variation={dashboardPanelData?.variacaoReceitaLiquida}
              currency
            />
            <KpiCard
              title="Margem Bruta"
              value={dashboardPanelData?.margemBruta}
              variation={dashboardPanelData?.variacaoMargemBruta}
              percent
            />
            <KpiCard
              title="Margem Líquida"
              value={dashboardPanelData?.margemLiquida}
              variation={dashboardPanelData?.variacaoMargemLiquida}
              percent
            />
          </Box>

          <MarginCarousel data={marginsData} />

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
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <CapitalDynamicsCarousel
                data={dinamicaCapitalData}
                onPrev={handlePrev}
                onNext={handleNext}
                currentIndex={index}
                onChangeIndex={setIndex}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 300 }}>
              <GestaoPrazoMedioCarousel
                data={gestaoPrazoMedioData}
                onPrev={handlePrev}
                onNext={handleNext}
                currentIndex={index}
                onChangeIndex={setIndex}
              />
            </Box>
          </Box>

          <Subtitle>Gestão de Liquidez</Subtitle>
          <Box sx={{ mb: 3 }}>
            <LiquidityChart data={gestaoLiquidezData} />
          </Box>
        </Box>

        {/* TABELAS */}
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
          />
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
        />
      </MainContainer>
    </MainTemplate>
  );
};
