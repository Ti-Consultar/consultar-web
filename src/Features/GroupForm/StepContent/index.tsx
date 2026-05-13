import { Box, TextField, Typography } from "@mui/material";
import { GroupFormData } from "../../../types/group";

interface GroupFormStepsProps {
  activeStep: number;
  formData: GroupFormData;
  errors: { [key: string]: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  entityLabel: string;
}

export const GroupFormSteps = ({
  activeStep,
  formData,
  errors,
  handleChange,
  entityLabel,
}: GroupFormStepsProps) => {
  const b = formData.businessEntity;

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#fff",
      minHeight: 48,
    },
    "& .MuiInputLabel-root": {
      fontSize: 14,
    },
    "& .MuiInputBase-input": {
      fontSize: 14,
      py: 1.35,
    },
  };

  const sectionSx = {
    display: "flex",
    gap: 2.25,
    flexDirection: "column",
  };

  const gridSx = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
    gap: 2,
  };

  switch (activeStep) {
    case 0:
      return (
        <Box sx={sectionSx}>
          <Box>
            <Typography sx={{ color: "#1f2937", fontSize: 18, fontWeight: 700 }}>
              Dados cadastrais
            </Typography>
            <Typography sx={{ color: "#667085", fontSize: 13, mt: 0.5 }}>
              Identificação fiscal e nome de exibição de {entityLabel}.
            </Typography>
          </Box>

          <Box sx={gridSx}>
            <TextField
              fullWidth
              label="CNPJ"
              name="cnpj"
              value={b.cnpj}
              onChange={handleChange}
              error={errors.cnpj}
              helperText={errors.cnpj ? "Campo obrigatório" : ""}
              disabled={!!formData.groupId}
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Nome Fantasia"
              name="nomeFantasia"
              value={b.nomeFantasia}
              onChange={handleChange}
              error={errors.nomeFantasia}
              helperText={errors.nomeFantasia ? "Campo obrigatório" : ""}
              size="small"
              sx={fieldSx}
            />
          </Box>
        </Box>
      );

    case 1:
      return (
        <Box sx={sectionSx}>
          <Box>
            <Typography sx={{ color: "#1f2937", fontSize: 18, fontWeight: 700 }}>
              Endereço comercial
            </Typography>
            <Typography sx={{ color: "#667085", fontSize: 13, mt: 0.5 }}>
              Localização principal usada para cadastro.
            </Typography>
          </Box>

          <Box sx={gridSx}>
            <TextField
              fullWidth
              label="CEP"
              name="cep"
              value={b.cep}
              onChange={handleChange}
              error={errors.cep}
              helperText={errors.cep && "Campo obrigatório"}
              required
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Bairro"
              name="bairro"
              value={b.bairro}
              onChange={handleChange}
              error={errors.bairro}
              helperText={errors.bairro && "Campo obrigatório"}
              required
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
            />
          </Box>
        </Box>
      );

    case 2:
      return (
        <Box sx={sectionSx}>
          <Box>
            <Typography sx={{ color: "#1f2937", fontSize: 18, fontWeight: 700 }}>
              Informações de contato
            </Typography>
            <Typography sx={{ color: "#667085", fontSize: 13, mt: 0.5 }}>
              Canais usados para comunicação administrativa.
            </Typography>
          </Box>

          <Box sx={gridSx}>
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              value={b.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email && "Campo obrigatório"}
              required
              size="small"
              sx={fieldSx}
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
              size="small"
              sx={fieldSx}
            />
          </Box>
        </Box>
      );

    default:
      return null;
  }
};
