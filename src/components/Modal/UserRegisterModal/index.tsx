import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Box,
  Dialog as AlertDialog,
  DialogContentText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Refresh,
  ContentCopy,
} from "@mui/icons-material";

interface UserRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ email: string; password: string }>;
}

const roles = [
  "Admin",
  "Gestor",
  "Usuario",
  "Consultor",
  "Comercial",
  "Desenvolvedor",
  "Designer",
];

export const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    role: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // limpa erro ao digitar
  };

  const handleGeneratePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-10);
    setFormData((prev) => ({ ...prev, password: randomPassword }));
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!formData.role)
      newErrors.role = "A permissão é obrigatória.";
    if (!formData.contact.trim())
      newErrors.contact = "O contato é obrigatório.";
    if (!formData.email.trim()) newErrors.email = "O email é obrigatório.";
    if (!formData.password.trim())
      newErrors.password = "A senha é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const result = await onSubmit(formData);
      setCreatedUser(result);
      setAlertOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 0,
            fontWeight: 600,
          }}
        >
          Cadastrar Novo Usuário
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <form autoComplete="off">
            <Stack spacing={2.5} mt={1}>
              <TextField
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                select
                label="Permissão"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.role}
                helperText={errors.role}
              >
                {roles.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Contato"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                fullWidth
                required
                placeholder="(00) 00000-0000"
                error={!!errors.contact}
                helperText={errors.contact}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Senha"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Gerar senha aleatória">
                        <IconButton onClick={handleGeneratePassword}>
                          <Refresh fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </form>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1.5 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta com credenciais */}
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Usuário Criado com Sucesso
        </DialogTitle>
        <DialogContent>
          {createdUser && (
            <Stack spacing={1.5} mt={1}>
              <DialogContentText>
                Compartilhe as credenciais abaixo com o novo usuário.
              </DialogContentText>
              <Box
                sx={{
                  backgroundColor: "grey.100",
                  p: 1.5,
                  borderRadius: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <strong>Email:</strong> {createdUser.email}
                  <br />
                  <strong>Senha:</strong> {createdUser.password}
                </Box>
                <Tooltip title="Copiar credenciais">
                  <IconButton
                    onClick={() =>
                      handleCopy(
                        `Usuário: ${createdUser.email}\nSenha: ${createdUser.password}`
                      )
                    }
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </AlertDialog>
    </>
  );
};
