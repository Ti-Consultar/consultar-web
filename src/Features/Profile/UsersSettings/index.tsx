import { useEffect, useState } from "react";
import { useMainContext } from "../../../contexts/mainContext";
import { MainTemplate } from "../../../components/AppLayout";
import { MainContainer, SectionContainer, SectionTitle, Title } from "./styles";
import { Box, Button, Grid2 } from "@mui/material";
import { ProfileOptions } from "../ProfileOptions";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { UserRegisterModal } from "../../../components/Modal/UserRegisterModal";
import { UserRegisterData } from "../../../types/userRegisterPayload";
import { useLoading } from "../../../contexts/LoadingProvider";
import { register } from "../../../services/apis/routes/auth.service";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { toast } from "react-toastify";

export const UsersSettings = () => {
  const { setBreadcrumbs } = useMainContext();
  const { setLoading } = useLoading();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { name: "Início", link: "/grupos" },
      { name: "Perfil", link: "/perfil" },
    ]);
  }, []);

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
                Adicionar
              </Button>
            </Box>
          </SectionContainer>
        </Box>
      </MainContainer>
      <UserRegisterModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSaveNewUser}
      />
    </MainTemplate>
  );
};
