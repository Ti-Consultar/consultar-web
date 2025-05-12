import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import DraftsRoundedIcon from "@mui/icons-material/DraftsRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { useState } from "react";

type InfoCardProps = {
  title?: string;
  phones: string;
  email: string;
  onDeleteFromHeader?: () => void;
  onEditFromHeader?: () => void;
};

export const InfoCard = ({
  title,
  phones,
  email,
  onDeleteFromHeader,
  onEditFromHeader,
}: InfoCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        width: "100%",
        marginBottom: "1rem",
        borderRadius: "10px",
        justifyContent: "space-between",
        backgroundColor: "var(--neutral-150)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="var(--neutral-500)"
          sx={{ mb: 1, display: "flex", alignItems: "center" }}
        >
          <WorkspacesRoundedIcon
            fontSize="medium"
            sx={{ mr: 1, color: "var(--neutral-500)" }}
          />
          {title}
        </Typography>

        <Box display="flex" alignItems="center" mb={1}>
          <LocalPhoneRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{phones}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <DraftsRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{email}</Typography>
        </Box>
      </CardContent>
      {/* <CardContent>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            textTransform: "none",
            mr: 1,
          }}
        >
          <ArrowDropDownIcon></ArrowDropDownIcon>
        </IconButton>
        Reativar menu ao adicionar funcionalidades
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 3,
              minWidth: 150,
              p: 1,
              bgcolor: "background.paper",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuItem onClick={onEditFromHeader}>
            <CreateIcon sx={{ mr: 1, fontSize: "18px" }} />
            Editar Grupo
          </MenuItem>
          <MenuItem
            onClick={onDeleteFromHeader}
            sx={{ color: "var(--status-error-950)" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: "18px" }} />
            Excluir Grupo
          </MenuItem>
        </Menu>
      </CardContent> */}
    </Card>
  );
};
