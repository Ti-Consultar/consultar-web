import { CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Header, StyledAvatar, StyledCard, CardActionsBox } from "./styles";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Protected } from "../Protection";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { usePermission } from "../../contexts/PermissionsContext";

interface GroupCardProps {
  fantasyName: string;
  corporateName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onInvite?: () => void;
}

export const GroupCard = ({
  fantasyName,
  corporateName,
  onEdit,
  onDelete,
  onClick,
  onInvite,
}: GroupCardProps) => {
  const { role } = usePermission();

  return (
    <StyledCard
      onClick={onClick}
      sx={{ borderRadius: "8px", border: "1px solid var(--neutral-300)" }}
      elevation={0}
    >
      <Header>
        <StyledAvatar>
          {(fantasyName || "").slice(0, 2).toUpperCase()}
        </StyledAvatar>

        <CardActionsBox
          className="card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton onClick={onInvite} size="small" color="inherit">
            {["Admin", "Gestor", "Desenvolvedor", "Consultor"].includes(
              role ?? ""
            ) ? (
              <GroupAddOutlinedIcon fontSize="small" />
            ) : (
              <PeopleOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <Protected
            allowedRoles={["Admin", "Desenvolvedor", "Consultor", "Gestor"]}
          >
            <IconButton onClick={onEdit} size="small" color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={onDelete} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Protected>
        </CardActionsBox>
      </Header>

      <CardContent sx={{ padding: 0, marginTop: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize="14px"
          noWrap
        >
          {corporateName}
        </Typography>
        <Typography variant="h6" fontWeight="bold" fontSize="25px" noWrap>
          {fantasyName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
