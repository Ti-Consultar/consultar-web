import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Pesquisar",
  size = "small",
  fullWidth = false,
}: SearchInputProps) => {
  return (
    <TextField
      size={size}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};
