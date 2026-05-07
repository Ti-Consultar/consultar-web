import React, { useState, useEffect } from "react"; // Adicionado React e Hooks
import { Box, Grid2 } from "@mui/material";
import { MainContainer, Title } from "./styles";
import { ProfileOptions } from "../ProfileOptions";
import { ProfileCard } from "./ProfileCard";

interface ProfileSettingProps {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
  onSave?: (data: any) => void; // Ajustado para receber os dados atualizados
  onEdit?: () => void;
}

export const ProfileSettings = ({
  name,
  role,
  email,
  phoneNumber: initialPhoneNumber, // Renomeado para controle interno
  onSave,
  onEdit,
}: ProfileSettingProps) => {
  // 1. Criamos o estado local para o telefone, igual ao seu modal
  const [phone, setPhone] = useState(initialPhoneNumber);

  // 2. Mantém o estado sincronizado se a prop mudar externamente
  useEffect(() => {
    setPhone(formatPhone(initialPhoneNumber));
  }, [initialPhoneNumber]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limitedDigits = digits.slice(0, 11);

    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    } else {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`;
    }
  };

  // 3. Função de mudança que intercepta a digitação, igual ao seu "handleChange"
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave({ name, role, email, phoneNumber: phone });
    }
  };

  return (
    <MainContainer>
      <Grid2 container>
        <Grid2>
          <ProfileOptions />
        </Grid2>
      </Grid2>
      <Box sx={{ margin: "2rem", width: "100%" }}>
        <Title>Informações do Perfil</Title>
        <ProfileCard
          email={email}
          name={name}
          role={role}
          contact={phone} // Passa o valor do estado local (já formatado)
          onEdit={onEdit}
          onSave={handleSaveClick}
          onChange={handlePhoneChange} // 4. Passa a função de mudança para o card
        />
      </Box>
    </MainContainer>
  );
};