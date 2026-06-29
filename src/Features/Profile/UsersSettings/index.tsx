import { useEffect, useState } from "react";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, SectionContainer, SectionTitle, Title } from "./styles";
import { Box, Button, Grid2, InputAdornment, TextField } from "@mui/material";
import { ProfileOptions } from "../ProfileOptions";
import { UserRegisterModal } from "../../../components/Modal/UserRegisterModal";
import { UserRegisterData } from "../../../types/userRegisterPayload";
import { useLoading } from "../../../contexts/LoadingProvider";
import {
  changeUserRole,
  getUserBySearch,
  register,
  registerFake,
} from "../../../services/apis/routes/auth.service";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "sonner";
import { UserRow } from "./UserRow";
import { UserSearchLoader } from "../../../components/UserSearchLoading";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import { AlertModal } from "../../../components/AlertModal";
import { FakeUserRegisterModal } from "../../../components/Modal/FakeUserRegisterModal";
import { useBreadcrumb } from "../../../utils/hooks/useBreadcrumb";

const UsersSettings = () => {
  useBreadcrumb("users");
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [openUserFakeModal, setOpenUserFakeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: number;
    newRole: string;
  } | null>(null);

  const handleSaveNewUser = async (
    data: UserRegisterData
  ): Promise<{ email: string; password: string }> => {
    try {
      setLoading(true, "Cadastrando usuário...");
      const response = await register(data);

      const message =
        typeof response === "string"
          ? response
          : typeof response.data === "string"
          ? response.data
          : response?.data?.message ||
            response?.message ||
            JSON.stringify(response);

      if (
        message?.toLowerCase().includes("sucesso") ||
        message?.toLowerCase().includes("inserido")
      ) {
        toast.success("Usuário cadastrado com sucesso.");
        return { email: data.email, password: data.password };
      } else {
        toast.error("Ocorreu um erro ao cadastrar o usuário.");
        throw new Error(message || "Erro ao cadastrar o usuário");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(
        "Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toApiPayload = (data: any) => ({
    name: data.name,
    contact: data.contact,
    role: data.role,
    email: data.email,
    senha: data.senha ?? data.password, // tolera casos antigos
  });

  const handleSaveFakeUser = async (data: any) => {
    try {
      setLoading(true, "Cadastrando usuário de demonstração...");

      const apiPayload = toApiPayload(data);
      const response = await registerFake(apiPayload);

      const message =
        typeof response === "string"
          ? response
          : typeof response.data === "string"
          ? response.data
          : response?.data?.message ||
            response?.message ||
            JSON.stringify(response);

      if (
        message?.toLowerCase().includes("sucesso") ||
        message?.toLowerCase().includes("inserido")
      ) {
        toast.success("Usuário cadastrado com sucesso.");
      } else {
        toast.error("Ocorreu um erro ao cadastrar o usuário.");
        console.error("Resposta inesperada:", response);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(
        "Ocorreu um erro ao cadastrar o usuário. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const term = searchTerm.trim();

      if (!term) {
        setUser(null);
        return;
      }

      try {
        setIsSearching(true);
        const response = await getUserBySearch(term);

        if (
          typeof response === "string" &&
          response.includes("Nenhum Usuário Encontrado")
        ) {
          setUser(null);
          return;
        }

        setUser(response);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      setLoading(true, "Atualizando permissão...");

      const response = await changeUserRole({
        userId,
        role: newRole,
      });

      const message =
        typeof response === "string"
          ? response
          : response?.data?.message || response?.message;

      if (
        message?.toLowerCase().includes("sucesso") ||
        message?.toLowerCase().includes("atualizado")
      ) {
        toast.success("Permissão atualizada com sucesso.");
      } else {
        toast.error("Falha ao atualizar permissão.");
        console.error("Resposta inesperada:", response);
      }

      if (searchTerm.trim()) {
        const refreshedUser = await getUserBySearch(searchTerm.trim());
        setUser(refreshedUser);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao atualizar permissão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <Title>Configurações do Perfil</Title>
      <MainContainer>
        <Grid2 container>
          <Grid2>
            <ProfileOptions />
          </Grid2>
        </Grid2>

        <Box sx={{ margin: "2rem", width: "100%" }}>
          <SectionTitle>Gerenciamento de Usuários</SectionTitle>
          <SectionContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                size="small"
                placeholder="Pesquisar usuário por e-mail ou telefone"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "60%",
                  backgroundColor: "var(--neutral-white)",
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setOpenUserFakeModal(true)}
                  startIcon={<InsertEmoticonOutlinedIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  Criar Usuário de Demonstração
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                  startIcon={<PersonAddOutlinedIcon />}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  Novo Usuário
                </Button>
              </Box>
            </Box>

            <Box mt={2}>
              {isSearching && (
                <Box mt={1}>
                  <UserSearchLoader />
                </Box>
              )}

              {!isSearching && !user && searchTerm && (
                <div>Nenhum usuário encontrado.</div>
              )}

              {user && (
                <UserRow
                  user={user}
                  onRoleChange={(userId, newRole) => {
                    setPendingRoleChange({ userId, newRole });
                    setConfirmOpen(true);
                  }}
                />
              )}
            </Box>
          </SectionContainer>
        </Box>
      </MainContainer>

      <AlertModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingRoleChange(null);
        }}
        title="Alterar Permissão"
        message={
          <>
            Tem certeza que deseja alterar a permissão deste usuário para{" "}
            <strong>{pendingRoleChange?.newRole}</strong>?
          </>
        }
        confirmText="Alterar"
        cancelText="Cancelar"
        type="warning"
        onConfirm={async () => {
          if (!pendingRoleChange) return;

          const { userId, newRole } = pendingRoleChange;
          setConfirmOpen(false);

          try {
            await handleChangeRole(userId, newRole);
          } finally {
            setPendingRoleChange(null);
          }
        }}
      />

      <UserRegisterModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSaveNewUser}
      />

      <FakeUserRegisterModal
        open={openUserFakeModal}
        onClose={() => setOpenUserFakeModal(false)}
        onSubmit={handleSaveFakeUser}
      />
    </MainTemplate>
  );
};

export default UsersSettings;
