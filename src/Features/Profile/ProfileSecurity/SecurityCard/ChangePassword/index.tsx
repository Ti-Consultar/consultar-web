import { ForgotPassword, FormContainer, SecurityCardContainer, SubTitle, Title } from "./styles";
import PasswordInput from "../../../../../components/Inputs/PasswordInput";
import { useState } from "react";
import { Button } from "@mui/material";
import PasswordInputWithValidation from "../../../../../components/Inputs/PasswordInput/PasswordInputWithValidation";

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SecurityCardContainer>
      <Title>Redefinir Senha</Title>
      <SubTitle>Para redefinir sua senha, por favor preencha os campos abaixo.</SubTitle>
      <FormContainer>
        <PasswordInput
          label="Senha atual"
          placeholder="Senha atual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
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
          sx={{
            width: "40%",
            textTransform: "none",
            mt: "1rem",
          }}
        >
          Redefinir Senha
        </Button>
        <ForgotPassword>Esqueceu a senha?</ForgotPassword>
      </FormContainer>
    </SecurityCardContainer>
  );
};
