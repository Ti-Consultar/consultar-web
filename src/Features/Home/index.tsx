import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout";
import {
  CardsContainer,
  EmptyStateContainer,
  MainContainer,
  NoItems,
  SubTitle,
  Title,
} from "./styles";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { Button } from "../../components/Button";
import { CompanyForm } from "../GroupForm";
import { toast } from "react-toastify";
import {
  deleteGroup,
  getGroupById,
  getGroupsByUserId,
  saveGroup,
  updateGroup,
} from "../../services/apis/routes/groups.service";
import { GroupCard } from "../../components/Card";
import { Alert, Typography, useMediaQuery } from "@mui/material";
import { useAuth } from "../../utils/hooks/useAuth";
import { GroupFormData } from "../../types/group";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { AlertModal } from "../../components/AlertModal";

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
  groupId: number;
  userId: number;
  groupName: string;
  businessEntity: businessEntity;
}

export const MrpHome = () => {
  const userId = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [groupList, setGroupList] = useState<GroupsResponse[]>([]);
  const [editingGroup, setEditingGroup] = useState<GroupFormData>();
  const [, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const dataDecoded: UserData = jwtDecode(token);
        setUserData(dataDecoded);
      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  const fetchGroups = async () => {
    setLoading(true, "Carregando grupos empresariais...");
    try {
      const response = await getGroupsByUserId(Number(userData?.userId));
      const data = response.data;
      setGroupList(data);
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

  useEffect(() => {
    if (userData?.userId) {
      fetchGroups();
    }
  }, [userData]);

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
        ? await updateGroup(editingGroup.groupId, data.userId, data)
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
        toast.error("Erro ao salvar os dados da empresa.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id: number, userId: number) => {
    setLoading(true, "Deletando Grupo");
    setError("");

    try {
      await deleteGroup(id, userId);
      toast.success("Grupo deletado com sucesso!");
      fetchGroups();
    } catch {
      toast.error("Erro ao deletar grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number, userId: number) => {
    try {
      setOpen(true);

      const data = await getGroupById(userId, id);
      setEditingGroup(data.data);
    } catch (error) {
      toast.error("Erro ao buscar grupo para edição.");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGroupId !== null && userId?.userId) {
      await handleDeleteGroup(selectedGroupId, Number(userId.userId));
      setSelectedGroupId(null);
    }
    setOpenDialog(false);
  };

  const handleCardClick = (groupId: number) => {
    navigate(`/grupo/${groupId}/empresas`);
  };

  return (
    <MainTemplate>
      <MainContainer>
        <Title>
          Bem-vindo, <span>{userData?.unique_name}</span>.
        </Title>
        <SubTitle>Acesse e administre suas empresas abaixo:</SubTitle>
        <Button
          text="Criar Grupo"
          variant="primary"
          onClick={() => setOpen(true)}
        />
        <CompanyForm
          onSubmit={onSubmit}
          externalActiveStep={activeStep}
          isOpen={open}
          onClose={() => setOpen(false)}
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
          title="Excluir Grupo"
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
              <span>Tem certeza que deseja deletar este grupo?</span>
              <Alert color="warning" severity="info">
                Esta ação também irá deletar todas as empresas atreladas a ela.
              </Alert>
            </div>
          }
          type="warning"
        />
      </MainContainer>
      {Array.isArray(groupList) && groupList.length > 0 ? (
        <CardsContainer container spacing={2}>
          {groupList?.map((group) => (
            <GroupCard
              key={group.groupId}
              fantasyName={
                group.businessEntity?.nomeFantasia || group.groupName
              }
              corporateName={group.businessEntity.razaoSocial}
              onEdit={() => handleEdit(Number(userId?.userId), group.groupId)}
              onClick={() => handleCardClick(group.groupId)}
              onDelete={() => {
                setOpenDialog(true);
                setSelectedGroupId(group.groupId);
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
