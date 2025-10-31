import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Role } from "../../../contexts/PermissionsContext";
import { Protected } from "../../../components/Protection";

interface MenuItem {
  label: string;
  path: string;
  allowedRoles?: Role[];
}

const menuItems: MenuItem[] = [
  { label: "Perfil", path: "/perfil/informacoes" },
  { label: "Segurança", path: "/perfil/seguranca" },
  {
    label: "Usuários",
    path: "/users",
    allowedRoles: ["Gestor"],
  },
  { label: "Personalização", path: "/perfil/personalizacao" },
];

export const ProfileOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        height: "80vh",
        p: 2,
        borderRight: "1px solid var(--neutral-150)",
        minWidth: "160px",
      }}
    >
      <List>
        {menuItems.map((item) => {
          const active = isActive(item.path);

          const row = (
            <ListItem disablePadding key={item.path} sx={{ mb: "12px" }}>
              <ListItemButton
                selected={active}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "15px",
                  color: active ? "black" : "text.primary",
                  "&.Mui-selected": {
                    backgroundColor: "#E9F2FF!important",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );

          return item.allowedRoles ? (
            <Protected key={item.path} allowedRoles={item.allowedRoles}>
              {row}
            </Protected>
          ) : (
            row
          );
        })}
      </List>
    </Box>
  );
};
