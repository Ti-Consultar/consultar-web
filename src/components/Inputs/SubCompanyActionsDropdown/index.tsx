import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface SubCompanyMenuProps {
  onAddCompany: () => void;
  onEditCompany: () => void;
  onInviteMembers: () => void;
  onDeactivateCompany: () => void;
}

export function SubCompanyMenu({
  onAddCompany,
  onEditCompany,
  onInviteMembers,
  onDeactivateCompany,
}: SubCompanyMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          borderRadius: "10px",
          height: "40px",
          background: "var(--neutral-white)",
          border: "1px solid #e4e4e4ff",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.08)",
          },
        }}
      >
        <MoreVertRoundedIcon sx={{ fontSize: 22 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        PaperProps={{
          sx: {
            minWidth: 210,
            borderRadius: 2,
            border: "1px solid #eee",
            boxShadow: "0 4px 12px rgba(255, 0, 0, 0.08)",
            paddingY: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onAddCompany();
          }}
        >
          <ListItemIcon>
            <AddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Adicionar Empresa / Marca" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onAddCompany();
          }}
        >
          <ListItemIcon>
            <AddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Adicionar Unidade" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onEditCompany();
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Editar Empresa / Marca" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onInviteMembers();
          }}
        >
          <ListItemIcon>
            <GroupAddRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Convidar membros" />
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            onDeactivateCompany();
          }}
          sx={{
            color: "error.main",
            "& svg": { color: "error.main" },
          }}
        >
          <ListItemIcon>
            <ArchiveOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Inativar Empresa / Marca" />
        </MenuItem>
      </Menu>
    </>
  );
}
