import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type Role =
  | "Admin"
  | "Gestor"
  | "Usuario"
  | "Consultor"
  | "Comercial"
  | "Desenvolvedor"
  | "Designer";

interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  role: Role | string;
}

interface UserRowProps {
  user: User;
  onRoleChange?: (id: number, newRole: Role) => void;
}

const roles: Role[] = [
  "Admin",
  "Gestor",
  "Usuario",
  "Consultor",
  "Comercial",
  "Desenvolvedor",
  "Designer",
];

export const UserRow: React.FC<UserRowProps> = ({ user, onRoleChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleSelectRole = (role: Role) => {
    setAnchorEl(null);
    onRoleChange?.(user.id, role);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1.5}
      sx={{ borderBottom: "1px solid #E0E0E0" }}
      gap={2}
      mt={2}
    >
      <Avatar sx={{ width: 40, height: 40 }}>{initials}</Avatar>

      <Stack flex={1}>
        <Typography fontWeight={600}>{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Stack>

      <Box display="flex" alignItems="center" sx={{ width: 160 }}>
        <Typography variant="body2" fontWeight={500}>
          {user.role}
        </Typography>

        <IconButton size="small" onClick={handleOpenMenu}>
          <ArrowDropDownIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {roles.map((role) => (
            <MenuItem key={role} onClick={() => handleSelectRole(role)}>
              {role}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};
