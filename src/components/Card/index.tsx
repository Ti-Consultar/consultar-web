import {
  CardContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Header, StyledAvatar, StyledCard } from "./styles";

interface GroupCardProps {
  fantasyName: string;
  corporateName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const GroupCard = ({
  fantasyName,
  corporateName,
  onEdit,
  onDelete,
}: GroupCardProps) => {
  return (
    <StyledCard>
      <Header>
        <StyledAvatar> {(fantasyName || '').slice(0, 2).toUpperCase()}</StyledAvatar>
        <Box>
          <IconButton onClick={onEdit} size="small" color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onDelete} size="small" color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Header>

      <CardContent sx={{ padding: 0, marginTop: 2 }}>
        <Typography variant="body2" color="text.secondary" fontSize={'14px'} noWrap >
          {corporateName}
        </Typography>
        <Typography variant="h6" fontWeight="bold" fontSize={'25px'} noWrap>
          {fantasyName}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
