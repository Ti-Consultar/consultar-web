import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import {
  CardsContainer,
  EmptyStateContainer,
  MainContainer,
  NoItems,
} from "./styles";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { CompanyForm } from "../GroupForm";
import { toast } from "sonner";
import {
  deleteGroup,
  getAllGroups,
  getDeletedGroups,
  getGroupById,
  restoreGroups,
  saveGroup,
  updateGroup,
} from "../../services/apis/routes/groups.service";
import { GroupCard } from "../../components/Card";
import { Alert, Typography } from "@mui/material";
import { useAuth } from "../../utils/hooks/useAuth";
import { GroupFormData } from "../../types/group";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { AlertModal } from "../../components/AlertModal";
import { useMainContext } from "../../contexts/mainContext";
import { InvitationModal } from "../Invitation/InvitationModal";
import { useRefresh } from "../../contexts/refreshContext";
import { GroupsHeader } from "./Header";

interface UserData {
  exp: number;
  iat: number;
  ip: string;
  role: string;
  unique_name: string;
  userId: string;
}

interface businessEntity {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
}

interface GroupsResponse {
  id: number;
  userId: number;
  groupName: string;
  businessEntity: businessEntity;
}

const Groups = () => {
  const userId = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [groupList, setGroupList] = useState<any[]>([]);
  const [filteredGroupList, setFilteredGroupList] = useState<GroupsResponse[]>(
    []
  );
  const [editingGroup, setEditingGroup] = useState<GroupFormData>();
  const [, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [, setErrors] = useState<{ [key: string]: boolean }>({});
  const [activeStep, setActiveStep] = useState(0);
  const { setBreadcrumbs } = useMainContext();
  const [openInvitationModal, setOpenInvitationModal] = useState(false);
  const [groupToBeInvited, setGroupToBeInvited] = useState<number>(0);
  const [notificationsRefreshTimestamp] = useRefresh("companies");
  const [deletedGroups, setDeletedGroups] = useState<any[]>([]);

  useEffect(() => {
    setBreadcrumbs([{ name: "Grupos", link: "/grupos" }]);
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch (error) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  const fetchGroups = async () => {
    setLoading(true, "Carregando grupos empresariais...");
    try {
      const response = await getAllGroups();
      const data = response.data;

      setGroupList(data);
      setFilteredGroupList(data);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        setError(error.message);
      } else {
        toast.error("Erro ao buscar os grupos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (selectedIds: number[]) => {
    try {
      setLoading(true, "Reativando empresas...");
      await restoreGroups(selectedIds);
      const updated = deletedGroups.filter((c) => !selectedIds.includes(c.id));
      setDeletedGroups(updated);
      toast.success("Empresas reativadas com sucesso!");
      fetchDeletedroups();
      fetchGroups();
    } catch (error) {
      toast.error("Erro ao reativar empresas");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedroups = async () => {
    try {
      const response = await getDeletedGroups();
      const formatted = response.data.map((item: any) => ({
        id: item.groupId,
        nome: item.businessEntity.nomeFantasia || item.companyName,
        cnpj: item.businessEntity.cnpj,
      }));
      setDeletedGroups(formatted);
    } catch (error) {
      console.error("Erro ao buscar grupos inativos", error);
    }
  };

  useEffect(() => {
    if (userData?.userId) {
      fetchGroups();
    }
    fetchDeletedroups();
    fetchGroups();
  }, [userData, notificationsRefreshTimestamp]);

  const onSubmit = async (data: GroupFormData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(data.businessEntity.email);

    if (!isValidEmail) {
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    setLoading(
      true,
      editingGroup?.groupId ? "Atualizando grupo..." : "Salvando grupo..."
    );

    try {
      const response = editingGroup?.groupId
        ? await updateGroup(editingGroup.groupId, data)
        : await saveGroup(data);

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
        const message = editingGroup?.groupId
          ? "Grupo atualizado com sucesso!"
          : "Grupo criado com sucesso!";

        toast.success(message);
      }, 500);

      fetchGroups();
      setEditingGroup(undefined);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast.error("Sua sessão expirou. Faça login novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    if (query.trim() === "") {
      setFilteredGroupList(groupList);
      return;
    }

    const filtered = groupList.filter((group) =>
      group.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredGroupList(filtered);
  };

  const handleDeleteGroup = async (id: number) => {
    setLoading(true, "Deletando Grupo");
    setError("");

    try {
      await deleteGroup(id);
      toast.success("Grupo deletado com sucesso!");
      fetchGroups();
    } catch {
      toast.error("Erro ao deletar grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      setOpen(true);
      const data = await getGroupById(id);
      setEditingGroup(data.data);
    } catch (error) {
      toast.error("Erro ao buscar grupo para edição.");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGroupId !== null && userId?.userId) {
      await handleDeleteGroup(selectedGroupId);
      setSelectedGroupId(null);
    }
    setOpenDialog(false);
  };

  const handleCardClick = (groupId: number) => {
    navigate(`/grupos/${groupId}/empresas`);
  };

  const handleOpenInvitationModal = (groupId: number) => {
    setOpenInvitationModal(true);
    setGroupToBeInvited(groupId);
  };

  return (
    <MainTemplate>
      <InvitationModal
        open={openInvitationModal}
        onClose={() => setOpenInvitationModal(false)}
        groupToBeInvited={groupToBeInvited}
      />
      <MainContainer>
        <GroupsHeader
          onSearchChange={handleSearchChange}
          onExportClick={() => {}}
          onAddGroupClick={() => setOpen(true)}
          viewMode={"grid"}
          onChangeViewMode={() => {}}
          deletedCompanies={deletedGroups}
          onReactivate={handleReactivate}
        />
        <CompanyForm
          onSubmit={onSubmit}
          externalActiveStep={activeStep}
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setEditingGroup(undefined);
          }}
          defaultValues={editingGroup}
          title="Adicionar Grupo Empresarial"
        />
        <AlertModal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={() => {
            handleConfirmDelete();
            setOpen(false);
          }}
          title="Inativar Grupo"
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
              <span>Deseja inativar este grupo?</span>
              <Alert color="warning" severity="info">
                Esta ação também irá inativar todas as empresas atreladas a ela.
              </Alert>
            </div>
          }
          type="warning"
        />
      </MainContainer>
      {Array.isArray(filteredGroupList) && filteredGroupList.length > 0 ? (
        <CardsContainer container spacing={2}>
          {filteredGroupList?.map((group) => (
            <GroupCard
              key={group.id}
              fantasyName={
                group.businessEntity?.nomeFantasia || group.groupName
              }
              corporateName={group.businessEntity.razaoSocial}
              onEdit={() => {
                handleEdit(group.id);
              }}
              onClick={() => handleCardClick(group.id)}
              onDelete={() => {
                setOpenDialog(true);
                setSelectedGroupId(group.id);
              }}
              onInvite={() => {
                handleOpenInvitationModal(group.id);
              }}
            />
          ))}
        </CardsContainer>
      ) : (
        <>
          <EmptyStateContainer>
            <NoItems>
              <ApartmentIcon color="action" fontSize="large"></ApartmentIcon>
            </NoItems>
            <Typography variant="h5" fontWeight="bold" textAlign={"center"}>
              Nenhum grupo encontrado.
            </Typography>
            <Typography
              variant="h6"
              fontWeight="medium"
              color="#888888"
              textAlign={"center"}
            >
              Não encontramos nenhum grupo atrelado ao seu usuário.
            </Typography>
          </EmptyStateContainer>
        </>
      )}
    </MainTemplate>
  );
};

export default Groups;
