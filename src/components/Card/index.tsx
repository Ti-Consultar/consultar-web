import { Box, CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Header, StyledAvatar, StyledCard } from "./styles";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Protected } from "../Protection";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";

interface GroupCardProps {
  fantasyName: string;
  corporateName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onInvite?: () => void;
  onReactivate?: () => void;
  isDeleted?: boolean;
}

export const GroupCard = ({
  fantasyName,
  corporateName,
  onEdit,
  onDelete,
  onClick,
  onInvite,
  isDeleted,
  onReactivate
}: GroupCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <StyledCard onClick={onClick} sx={{ borderRadius: "8px" }} elevation={0}>
      <Header>
        <StyledAvatar>
          {(fantasyName || "").slice(0, 2).toUpperCase()}
        </StyledAvatar>

        <IconButton
          className="card-menu-button"
          onClick={handleOpenMenu}
          size="small"
          sx={{
            opacity: 0,
            transform: "translateY(-5px)",
            transition: "all .2s ease",
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Header>

      <CardContent sx={{ padding: 0, marginTop: 2 }}>
        <Typography
          variant="inherit"
          color="text.secondary"
          fontSize="14px"
          noWrap
        >
          {corporateName ? corporateName : "..."}
        </Typography>
        <Typography
          variant="inherit"
          fontWeight="medium"
          fontSize="16px"
          noWrap
        >
          {fantasyName}
        </Typography>

        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 18,
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 500,
            background: isDeleted ? "#F1EFE8" : "#ffffff",
            color: isDeleted ? "#5F5E5A" : "#3B6D11",
          }}
        >
          {isDeleted ? "Inativo" : ""}
        </Box>

      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              minWidth: 150,
              p: 1,
              bgcolor: "background.paper",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      >
        {!isDeleted && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onInvite?.();
            }}
          >
            <ListItemIcon>
              <GroupAddOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Convidar</ListItemText>
          </MenuItem>
        )}

        <Protected allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}>
          {!isDeleted ? (
            <>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onEdit();
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onDelete();
                }}
              >
                <ListItemIcon>
                  <Inventory2OutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Inativar</ListItemText>
              </MenuItem>
            </>
          ) : (
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                onReactivate?.();
              }}
            >
              <ListItemIcon>
                <Inventory2OutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reativar</ListItemText>
            </MenuItem>
          )}
        </Protected>
      </Menu>
    </StyledCard>
  );
};
