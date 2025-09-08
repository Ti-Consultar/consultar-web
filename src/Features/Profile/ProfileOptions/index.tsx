import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Informações do Perfil", path: "/perfil/informacoes" },
  { label: "Segurança", path: "/perfil/seguranca" },
  { label: "Personalização", path: "/perfil/personalizacao" },
];

export const ProfileOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{ height: "80vh", p: 2, borderRight: "1px solid var(--neutral-150)" }}
    >
      <List>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem
              disablePadding
              key={item.path}
              sx={{ marginBottom: "12px" }}
            >
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
        })}
      </List>
    </Box>
  );
};
