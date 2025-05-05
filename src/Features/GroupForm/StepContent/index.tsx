import { Box, TextField, Typography } from "@mui/material";
import { GroupFormData } from "../../../types/group";

interface GroupFormStepsProps {
  activeStep: number;
  formData: GroupFormData;
  errors: { [key: string]: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GroupFormSteps = ({
  activeStep,
  formData,
  errors,
  handleChange,
}: GroupFormStepsProps) => {
  const b = formData.businessEntity;

  switch (activeStep) {
    case 0:
      return (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Typography sx={{ mt: 2, mb: 1 }}>Dados da Empresa</Typography>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
            <TextField
              fullWidth
              label="CNPJ"
              name="cnpj"
              value={b.cnpj}
              onChange={handleChange}
              error={errors["cnpj"]}
              helperText={errors["cnpj"] ? "Campo obrigatório" : ""}
              disabled={!!formData.userId}
            />
            <TextField
              fullWidth
              label="Razão Social"
              name="razaoSocial"
              value={b.razaoSocial}
              onChange={handleChange}
              error={errors.razaoSocial}
              helperText={errors.razaoSocial ? "Campo obrigatório" : ""}
              disabled
            />
            <TextField
              fullWidth
              label="Nome Fantasia"
              name="nomeFantasia"
              value={b.nomeFantasia}
              onChange={handleChange}
              error={errors.nomeFantasia}
              helperText={errors.nomeFantasia ? "Campo obrigatório" : ""}
            />
          </Box>
        </Box>
      );

    case 1:
      return (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Typography sx={{ mt: 2, mb: 1 }}>Endereço Comercial</Typography>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
            <TextField
              fullWidth
              label="CEP"
              name="cep"
              value={b.cep}
              onChange={handleChange}
              error={errors.cep}
              helperText={errors.cep && "Campo obrigatório"}
              required
            />
            <TextField
              fullWidth
              label="Endereço"
              name="logradouro"
              value={b.logradouro}
              onChange={handleChange}
              error={errors.logradouro}
              helperText={errors.logradouro && "Campo obrigatório"}
              required
            />
            <TextField
              fullWidth
              label="Número"
              name="numero"
              value={b.numero}
              onChange={handleChange}
              error={errors.numero}
              helperText={errors.numero && "Campo obrigatório"}
              required
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={b.bairro}
              onChange={handleChange}
              error={errors.bairro}
              helperText={errors.bairro && "Campo obrigatório"}
              required
            />
            <TextField
              fullWidth
              label="Município"
              name="municipio"
              value={b.municipio}
              onChange={handleChange}
              error={errors.municipio}
              helperText={errors.municipio && "Campo obrigatório"}
              required
            />
            <TextField
              fullWidth
              label="UF"
              name="uf"
              value={b.uf}
              onChange={handleChange}
              error={errors.uf}
              helperText={errors.uf && "Campo obrigatório"}
              required
            />
          </Box>
        </Box>
      );

    case 2:
      return (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <Typography sx={{ mt: 2, mb: 1 }}>Informações de Contato</Typography>
          <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              value={b.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email && "Campo obrigatório"}
              required
            />
            <TextField
              fullWidth
              label="DDD + Telefone"
              name="telefone"
              value={b.telefone}
              onChange={handleChange}
              error={errors.telefone}
              helperText={errors.telefone && "Campo obrigatório"}
              required
            />
          </Box>
        </Box>
      );

    default:
      return null;
  }
};
