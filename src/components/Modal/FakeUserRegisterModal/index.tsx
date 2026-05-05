// FakeUserRegisterModal.tsx
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
} from "@mui/material";
import { Visibility, VisibilityOff, Refresh } from "@mui/icons-material";
import { formatPhone } from "../../../utils/formatters/phoneMask";

interface UserRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    contact: string;
    role: string;
    email: string;
    senha: string;
    __plainPassword?: string;
  }) => void | Promise<void>;
}

const permissions = [
  "Admin",
  "Gestor",
  "Usuário",
  "Consultor",
  "Comercial",
  "Desenvolvedor",
  "Designer",
];

const emptyForm = {
  name: "",
  contact: "",
  role: "",
  email: "",
  password: "",
};

export const FakeUserRegisterModal: React.FC<UserRegisterModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = name === "contact" ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: formatted }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClose = () => {
    setFormData(emptyForm);
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  const handleGeneratePassword = () => {
    const randomPassword = Math.random().toString(36).slice(-10);
    setFormData((prev) => ({ ...prev, password: randomPassword }));
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Campo obrigatório";
    if (!formData.role) newErrors.role = "Campo obrigatório";
    if (!formData.contact.trim()) newErrors.contact = "Campo obrigatório";
    if (!formData.email.trim()) newErrors.email = "Campo obrigatório";
    if (!formData.password.trim()) newErrors.password = "Campo obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitClick = () => {
    if (!validateFields()) return;

    const payload = {
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      role: formData.role,
      email: formData.email.trim(),
      senha: formData.password,
      __plainPassword: formData.password,
    };

    onSubmit(payload);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 0 }}>
        Cadastrar Novo Usuário
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
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
            {permissions.map((p) => (
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
            value={formData.email}
            type="email"
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
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1.5 }}>
        <Button onClick={handleClose}>Cancelar</Button> {/* 👈 */}
        <Button variant="contained" onClick={handleSubmitClick}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};