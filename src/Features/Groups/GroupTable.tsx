import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useState } from "react";
import { Protected } from "../../components/Protection";

interface Group {
  id: number;
  groupName?: string;
  businessEntity?: {
    nomeFantasia?: string;
    razaoSocial?: string;
  };
  isDeleted?: boolean;
}

interface GroupsTableProps {
  groups: Group[];
  onClick: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onInvite: (id: number) => void;
  onReactivate: (id: number) => void;
}

export const GroupsTable = ({
  groups,
  onClick,
  onEdit,
  onDelete,
  onInvite,
  onReactivate,
}: GroupsTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const selectedGroup = groups.find((g) => g.id === selectedId);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#646464ff" }}>Nome do grupo</TableCell>
            <TableCell sx={{ color: "#646464ff" }}>Razão social</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {groups.map((group) => {
            const fantasyName =
              group.businessEntity?.nomeFantasia || group.groupName || "";
            const corporateName = group.businessEntity?.razaoSocial || "";

            return (
              <TableRow
                key={group.id}
                hover
                onClick={() => onClick(group.id)}
                sx={{
                  cursor: "pointer",
                }}
              >
                {/* Nome + Avatar */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        bgcolor: "#E1F5EE",
                        color: "#085041",
                        borderRadius: 2,
                      }}
                    >
                      {fantasyName.slice(0, 2).toUpperCase()}
                    </Avatar>

                    <Typography fontWeight={500}>{fantasyName}</Typography>
                  </Box>
                </TableCell>

                {/* Razão social */}
                <TableCell>
                  <Typography color="text.secondary" noWrap>
                    {corporateName || "..."}
                  </Typography>
                </TableCell>

                {/* Menu */}
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleOpenMenu(e, group.id)}
                    size="small"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* MENU GLOBAL */}
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
            },
          },
        }}
      >
        {!selectedGroup?.isDeleted && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onInvite(selectedId!);
            }}
          >
            <ListItemIcon>
              <GroupAddOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Convidar</ListItemText>
          </MenuItem>
        )}

        <Protected
          allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
        >
          {!selectedGroup?.isDeleted ? (
            <>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  onEdit(selectedId!);
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
                  onDelete(selectedId!);
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
                onReactivate(selectedId!);
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
    </TableContainer>
  );
};
