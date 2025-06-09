import {
  Avatar,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

type MemberRole = {
  name: string;
  id: number;
};

type MemberCardProps = {
  name: string;
  email: string;
  role: string;
  isCurrentUser?: boolean;
  roles: MemberRole[];
  onRoleChange: (newRole: string) => void;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const MemberCard = ({
  name,
  email,
  role,
  roles,
  onRoleChange,
  isCurrentUser,
}: MemberCardProps) => {
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    onRoleChange(event.target.value);
  };
  
  return (
    <Box
      sx={{
        py: 2,
        px: 1,
        width: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ backgroundColor: "var(--branding-default-red)" }}>
            {getInitials(name)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {name} {isCurrentUser && <span>(você)</span>}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Stack>

        {/* <Select
          size="small"
          value={role}
          onChange={handleRoleChange}
          sx={{ minWidth: 120 }}
        >
          {(roles ?? []).map((r) => (
            <MenuItem key={r.name} value={r.name}>
              {r.name}
            </MenuItem>
          ))}
        </Select> */}
        <Typography variant="body2" color="text.secondary">
          {role}
        </Typography>
      </Stack>
    </Box>
  );
};
