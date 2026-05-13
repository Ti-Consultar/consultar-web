import { useNavigate, useParams } from "react-router-dom";
import { MainTemplate } from "../../components/AppLayout";
import { MainContainer, Title } from "./styles";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

import { CompanyForm } from "../GroupForm";
import {
  deleteCompany,
  getCompanyById,
  saveCompany,
  updateCompany,
} from "../../services/apis/routes/companies.service";
import { deleteGroup, getGroupById, updateGroup } from "../../services/apis/routes/groups.service";
import { getBreadcrumb } from "../../services/apis/routes/breadcrumb.service";

import { useMainContext } from "../../contexts/mainContext";
import { useAuth } from "../../utils/hooks/useAuth";
import { useLoading } from "../../contexts/LoadingProvider";
import { toast } from "sonner";

import { GroupFormData } from "../../types/group";

import CompanyNavigationDropdown from "../../components/Inputs/CompanyNavigationDropdown";
import { getDropdownNavigation } from "../../services/apis/routes/companies.service";
import { CompanyResponse } from "../../types/companyDropdown";
import { DashboardPage } from "../Dashboard";
import DashboardIcon from "../../assets/icons/duo-icons_dashboard.svg";
import theme from "../../styles/theme";
import { CompanyMenu } from "../../components/Inputs/CompanyActionsDropdown";
import { AlertModal } from "../../components/AlertModal";
import { InvitationModal } from "../Invitation/InvitationModal";
import { saveSubCompany, updateSubCompany } from "../../services/apis/routes/subcompanies.service";
import YearPicker from "../../components/Inputs/YearPicker";
import { useYear } from "../../contexts/YearContext";

const Companies = () => {
  const { groupId, companyId } = useParams<{
    groupId: string;
    companyId?: string;
  }>();

  const userData = useAuth();
  const { setLoading } = useLoading();
  const { setBreadcrumbs } = useMainContext();

  const [, setGroupData] = useState<any>(null);
  const navigate = useNavigate();

  const [dropdownData, setDropdownData] = useState<CompanyResponse | null>(
    null
  );

  const [editingCompany, setEditingCompany] = useState<GroupFormData>();
  const [open, setOpen] = useState(false);
  const {year, setYear} = useYear();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openUnlinkDialog, setOpenUnlinkDialog] = useState(false);

  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const [groupToBeInvited, setGroupToBeInvited] = useState<number | undefined>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupResponse] = await Promise.all([
        getGroupById(Number(groupId)),
      ]);

      setGroupData(groupResponse.data);
    } catch {
      toast.error("Erro ao carregar dados das empresas");
    } finally {
      setLoading(false);
    }
  };

  // dropdown navigation
  const fetchDropdown = async () => {
    try {
      if (!groupId) return;
      const response = await getDropdownNavigation(Number(groupId));
      setDropdownData(response);
    } catch {
      console.error("Erro ao buscar dropdown");
    }
  };

  // breadcrumb
  useEffect(() => {
    const load = async () => {
      if (!groupId) return;

      const items = await getBreadcrumb({
        id: Number(groupId),
        type: "group",
      });

      setBreadcrumbs([{ name: "Grupos", link: "/grupos" }, ...items]);
    };

    load();
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchData();
      fetchDropdown();
    }
  }, [groupId]);

  const onSubmit = async (data: GroupFormData) => {
    const updatedData = {
      ...data,
      groupId: Number(groupId),
      companyId: Number(companyId),
      userId: Number(userData?.userId),
    };

    try {
      setLoading(true, companyId ? "Salvando unidade..." : "Salvando empresa / marca...");

      let response;

      if (companyId) {
        // Fluxo de SubCompany
        response = editingCompany
          ? await updateSubCompany(updatedData, editingCompany.groupId!)
          : await saveSubCompany(updatedData);
      } else {
        // Fluxo de Company normal
        response = editingCompany
          ? await updateCompany(updatedData, editingCompany.groupId!)
          : await saveCompany(updatedData);
      }

      if (!response.success) {
        toast.error(companyId ? "Erro ao salvar unidade" : "Erro ao salvar empresa / marca");
        return;
      }

      toast.success(companyId ? "Unidade salva com sucesso!" : "Empresa / marca salva com sucesso!");
      setEditingCompany(undefined);
      setOpen(false);
      fetchData();
      fetchDropdown();
    } catch (error) {
      toast.error("Erro ao salvar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = async () => {
    const parsedGroupId = groupId ? Number(groupId) : undefined;
    const parsedCompanyId = companyId ? Number(companyId) : undefined;

    if (parsedCompanyId && parsedGroupId) {
      try {
        setLoading(true, "Carregando empresa / marca...");

        const response = await getCompanyById(parsedCompanyId, parsedGroupId);

        if (!response.success) {
          toast.error("Erro ao carregar empresa / marca.");
          return;
        }

        setEditingCompany(response.data);
        setOpen(true);
      } catch (e) {
        toast.error("Erro ao carregar empresa / marca");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (parsedGroupId) {
      try {
        setLoading(true, "Carregando grupo...");

        const response = await getGroupById(parsedGroupId);

        if (!response.success) {
          toast.error("Erro ao carregar grupo.");
          return;
        }

        setEditingCompany(response.data);
        setOpen(true);
      } catch {
        toast.error("Erro ao carregar grupo");
      } finally {
        setLoading(false);
      }
    }
  };

  const onEdit = async (data: GroupFormData) => {
    const parsedGroupId = Number(groupId);                  // sempre existe
    const parsedCompanyId = companyId ? Number(companyId) : null;

    const updatedData = {
      ...data,
      groupId: parsedGroupId,
      userId: Number(userData?.userId),
    };

    try {
      setLoading(
        true,
        parsedCompanyId ? "Atualizando empresa / marca..." : "Atualizando grupo..."
      );

      let response;

      if (parsedCompanyId) {
        // --- EDITAR EMPRESA ---
        response = await updateCompany(updatedData, parsedCompanyId);
      } else {
        // --- EDITAR GRUPO ---
        response = await updateGroup(parsedGroupId, updatedData);
      }

      if (!response.success) {
        toast.error("Erro ao atualizar.");
        return;
      }

      toast.success(parsedCompanyId ? "Empresa / marca atualizada!" : "Grupo atualizado!");

      setEditingCompany(undefined);
      setOpen(false);
      fetchData();
      fetchDropdown();

    } catch {
      toast.error("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleInactivate = async () => {
    try {
      setLoading(true, "Inativando...");

      // --- INATIVAR EMPRESA ---
      if (companyId) {
        const response = await deleteCompany(
          Number(companyId),
          Number(groupId)
        );

        if (!response.success) {
          toast.error("Erro ao inativar empresa / marca");
          return;
        }

        toast.success("Empresa / marca inativada com sucesso!");
        navigate(`/grupos/${groupId}/empresas`);
        fetchDropdown?.();
        fetchData?.();
        return;
      }

      // --- INATIVAR GRUPO ---
      if (groupId) {
        const response = await deleteGroup(Number(groupId));

        if (!response.success) {
          toast.error("Erro ao inativar grupo");
          return;
        }

        toast.success("Grupo inativado com sucesso!");
        navigate(`/grupos`);
        fetchDropdown?.();
        fetchData?.();
        return;
      }

      toast.error("Nível inválido para inativação.");

    } catch (error) {
      toast.error("Erro ao inativar.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvitationModal = async () => {
    try {
      setLoading(true, "Carregando dados do convite...");

      // SEMPRE extraia IDs corretos do params
      const parsedGroupId = groupId ? Number(groupId) : undefined;
      const parsedCompanyId = companyId ? Number(companyId) : undefined;

      if (!parsedGroupId) {
        toast.error("Grupo inválido.");
        return;
      }

      const inviteTargetId = parsedCompanyId ?? parsedGroupId;
      setGroupToBeInvited(inviteTargetId);

      setOpenInvitationModal(true);
    } catch (error) {
      toast.error("Erro ao carregar informações do convite.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Company dropdown */}
          {dropdownData && (
            <Box sx={{ width: "20%", mb: 3 }}>
              <CompanyNavigationDropdown
                data={dropdownData.data}
                selectedId={companyId ? Number(companyId) : Number(groupId)}
                onChange={({ id, type, parentId }) => {
                  if (type === "group")
                    return navigate(`/grupos/${id}/empresas`);

                  if (type === "filial")
                    return navigate(`/grupos/${groupId}/empresas/${id}/filiais`);

                  if (type === "sub")
                    return navigate(
                      `/grupos/${groupId}/empresas/${parentId}/filiais/${id}`
                    );
                }}
              />
            </Box>
          )}

          <YearPicker 
            year={year}
            onChange={(newYear) => setYear(newYear)}
          />

          <CompanyMenu
            onAddCompany={() => setOpen(true)}
            onEditCompany={handleEditCompany}
            onInviteMembers={handleOpenInvitationModal}
            onDeactivateCompany={() => setOpenUnlinkDialog(true)}
            createCompanyText={companyId ? "Adicionar Unidade" : "Adicionar Empresa / Marca"}
          />
        </Box>

        <DashboardPage year={year} />

        <CompanyForm
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setEditingCompany(undefined);
          }}
          title={
            editingCompany
              ? companyId
                ? "Editar Empresa / Marca"
                : "Editar Grupo Empresarial"
              : companyId
                ? "Adicionar Unidade"
                : "Adicionar Empresa / Marca"
          }
          entityLabel={
            editingCompany
              ? companyId
                ? "Empresa / Marca"
                : "Grupo Empresarial"
              : companyId
                ? "Unidade"
                : "Empresa / Marca"
          }
          onSubmit={editingCompany ? onEdit : onSubmit}
          defaultValues={editingCompany}
        />

        <AlertModal
          open={openUnlinkDialog}
          onClose={() => setOpenUnlinkDialog(false)}
          onConfirm={() => {
            handleInactivate();
            setOpenUnlinkDialog(false);
          }}
          title="Inativar empresa / marca"
          confirmText="Sim, inativar"
          cancelText="Cancelar"
          message={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                gap: "10px",
              }}
            >
              <span style={{ textAlign: "center" }}>
                Tem certeza que deseja inativar essa empresa / marca?
              </span>
            </div>
          }
          type="warning"
        />

        <InvitationModal
          open={openInvitationModal}
          onClose={() => setOpenInvitationModal(false)}
          groupToBeInvited={groupToBeInvited}
          companyId={companyId ? Number(companyId) : undefined}
        />
      </MainContainer>
    </MainTemplate>
  );
};

export default Companies;
