import { CardContent, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Header, StyledAvatar, StyledCard, CardActionsBox } from "./styles";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

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
  onInvite
}: GroupCardProps) => {
  return (
    <StyledCard onClick={onClick} sx={{ borderRadius: "8px" }}>
      <Header>
        <StyledAvatar>
          {(fantasyName || "").slice(0, 2).toUpperCase()}
        </StyledAvatar>

        <CardActionsBox
          className="card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton onClick={onInvite} size="small" color="inherit">
            <GroupAddOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onEdit} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onDelete} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
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
