import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Box, useMediaQuery } from "@mui/material";
import { toast } from "sonner";

import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, Title } from "../styles";

import {
  getBranches,
  getSubCompanyById,
  saveSubCompany,
  updateSubCompany,
} from "../../../services/apis/routes/subcompanies.service";

import {
  getCompanyById,
  getDropdownNavigation,
} from "../../../services/apis/routes/companies.service";
import { CompanyForm } from "../../GroupForm";

import { useLoading } from "../../../contexts/LoadingProvider";
import { useMainContext } from "../../../contexts/mainContext";

import { getBreadcrumb } from "../../../services/apis/routes/breadcrumb.service";
import { GroupFormData } from "../../../types/group";

import CompanyNavigationDropdown from "../../../components/Inputs/CompanyNavigationDropdown";
import { CompanyResponse } from "../../../types/companyDropdown";
import { DashboardPage } from "../../Dashboard";
import DashboardIcon from "../../../assets/icons/duo-icons_dashboard.svg";
import theme from "../../../styles/theme";
import { CompanyMenu } from "../../../components/Inputs/CompanyActionsDropdown";
import { InvitationModal } from "../../Invitation/InvitationModal";
import YearPicker from "../../../components/Inputs/YearPicker";
import { useYear } from "../../../contexts/YearContext";

const Branches = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { setBreadcrumbs } = useMainContext();

  const { groupId, companyId, subCompanyId } = useParams<{
    groupId: string;
    companyId: string;
    subCompanyId: string;
  }>();

  const [, setBranches] = useState<any[]>([]);
  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null,
  );

  const [editingBranch, setEditingBranch] = useState<GroupFormData>();
  const [open, setOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const { year, setYear } = useYear();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ============================
  // FETCH BRANCHES
  // ============================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchResponse] = await Promise.all([
        getCompanyById(Number(companyId), Number(groupId)),
        getBranches(Number(companyId)),
      ]);

      setBranches(branchResponse.data ?? []);
    } catch (error) {
      toast.error("Erro ao buscar unidades");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao carregar dropdown");
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!companyId) return;

      const items = await getBreadcrumb({
        id: Number(companyId),
        type: "company",
      });

      const modifiedItems = items.map((item: any) => {
        if (item.type === "group") {
          return { ...item, link: `/grupos/${groupId}/empresas/` };
        }
        return item;
      });

      setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...modifiedItems]);
    };

    load();
  }, [companyId]);

  // ============================
  // ON SUBMIT (FORM)
  // ============================
  const onSubmit = async (data: GroupFormData) => {
    setLoading(true, "Salvando...");

    try {
      const payload = {
        ...data,
        companyId: Number(companyId),
      };

      let response;

      if (editingBranchId) {
        response = await updateSubCompany(payload, editingBranchId);
      } else {
        response = await saveSubCompany(payload);
      }

      if (!response.success) {
        toast.error("Erro ao salvar unidade");
        return;
      }

      toast.success(editingBranchId ? "Unidade atualizada!" : "Unidade criada!");

      setOpen(false);
      setEditingBranch(undefined);
      setEditingBranchId(null);
      fetchData();
      fetchDropdown();
    } catch {
      toast.error("Erro ao salvar unidade");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // NAVIGATION HANDLER
  // ============================
  const handleNavigation = ({
    id,
    type,
    parentId,
  }: {
    id: number;
    type: string;
    parentId?: number;
  }) => {
    const group = Number(groupId);

    if (type === "group") {
      return navigate(`/grupos/${id}/empresas/`);
    }

    if (type === "filial") {
      return navigate(`/grupos/${group}/empresas/${id}/filiais/`);
    }

    if (type === "sub") {
      return navigate(`/grupos/${group}/empresas/${parentId ?? companyId}/filiais/${id}`);
    }
  };

  const handleEditBranch = async () => {
    if (!companyId || !subCompanyId) {
      toast.error("Unidade inválida para edição.");
      return;
    }

    try {
      setLoading(true, "Carregando unidade...");

      const response = await getSubCompanyById(
        Number(subCompanyId),
        Number(companyId),
      );

      if (!response.success) {
        toast.error("Erro ao carregar unidade.");
        return;
      }

      setEditingBranch(response.data);
      setEditingBranchId(Number(subCompanyId));
      setOpen(true);
    } catch {
      toast.error("Erro ao carregar unidade.");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    if (groupId && companyId) {
      fetchData();
      fetchDropdown();
    }
  }, [groupId, companyId]);

  // ============================
  // RENDER
  // ============================
  return (
    <MainTemplate>
      <MainContainer>
        <Box
          sx={{
            display: "flchex",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            ml: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <img src={DashboardIcon} alt="" />
            <Title>Dashboard</Title>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
          {/* Dropdown */}
          {dropdownData && (
            <Box sx={{ width: "20%", mb: 3 }}>
              <CompanyNavigationDropdown
                data={dropdownData.data}
                selectedId={
                  subCompanyId
                    ? Number(subCompanyId)
                    : companyId
                      ? Number(companyId)
                      : Number(groupId)
                }
                onChange={handleNavigation}
              />
            </Box>
          )}

          <YearPicker year={year} onChange={(newYear) => setYear(newYear)} />

          <CompanyMenu
            onAddCompany={() => setOpen(true)}
            onEditCompany={handleEditBranch}
            onInviteMembers={() => setOpenInvitationModal(true)}
            onDeactivateCompany={() => console.log("Inativar")}
            hideCompanyCreation
          />
        </Box>

        {/* DASHBOARD */}
        <DashboardPage year={year} />

        {/* FORM */}
        <CompanyForm
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setEditingBranch(undefined);
            setEditingBranchId(null);
          }}
          title={editingBranch ? "Editar Unidade" : "Adicionar Unidade"}
          entityLabel="Unidade"
          onSubmit={onSubmit}
          defaultValues={editingBranch}
        />

        <InvitationModal
          open={openInvitationModal}
          onClose={() => setOpenInvitationModal(false)}
          groupToBeInvited={groupId ? Number(groupId) : undefined}
          companyId={companyId ? Number(companyId) : undefined}
          subCompanyId={subCompanyId ? Number(subCompanyId) : undefined}
        />
      </MainContainer>
    </MainTemplate>
  );
};

export default Branches;
