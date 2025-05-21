import {
  FormControl,
  InputAdornment,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

type RoleOption = {
  value: string;
  label: string;
};

interface EmailWithRoleInputProps {
  email: string;
  role?: string;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  roleOptions?: RoleOption[];
}

export const EmailWithRoleInput = ({
  email,
  role = 'usuario',
  onEmailChange,
  onRoleChange,
  roleOptions = [],
}: EmailWithRoleInputProps) => {
  return (
    <FormControl fullWidth variant="standard">
      <OutlinedInput
        id="email-input"
        placeholder="Informe o e-mail de quem você irá convidar"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        sx={{
          height: 45,
          borderRadius: 3,
          "& input": {
            padding: "12px 14px",
          },
        }}
        endAdornment={
          <InputAdornment position="end">
            <Select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{ minWidth: 100, borderRadius: 10 }}
            >
              {roleOptions.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
