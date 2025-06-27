import {
  ForgotPassword,
  FormContainer,
  SecurityCardContainer,
  SubTitle,
  Title,
} from "./styles";
import PasswordInput from "../../../../../components/Inputs/PasswordInput";
import { useState } from "react";
import { Button, Snackbar, Alert, TextField, Typography } from "@mui/material";
import PasswordInputWithValidation from "../../../../../components/Inputs/PasswordInput/PasswordInputWithValidation";
import { redefinePassword } from "../../../../../services/apis/routes/auth.service";
import { toast } from "react-toastify";

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.warning("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      await redefinePassword(newPassword);
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Erro ao alterar senha!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecurityCardContainer>
      <Title>Redefinir Senha</Title>
      <SubTitle>
        Para redefinir sua senha, por favor preencha os campos abaixo.
      </SubTitle>
      <FormContainer>
        <PasswordInputWithValidation
          label="Nova senha"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirmar nova senha"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePasswordChange}
          disabled={loading || !newPassword || !confirmPassword}
          sx={{
            width: "40%",
            textTransform: "none",
            mt: "1rem",
          }}
        >
          {loading ? "Salvando..." : "Redefinir Senha"}
        </Button>
      </FormContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </SecurityCardContainer>
  );
};
