import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Informações do Perfil", path: "/perfil/informacoes" },
  { label: "Segurança", path: "/perfil/seguranca" },
];

export const ProfileOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{ height: "80vh", p: 2, borderRight: '1px solid var(--neutral-150)' }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.path} sx={{marginBottom: '12px'}}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{borderRadius: '15px'}}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
