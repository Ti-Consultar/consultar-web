import { Input } from "@mui/material";
import type { CSSProperties } from "react";

interface EditableTableProps {
  value: string;
  onChangeDraft: (changeValue: string) => void;
  isEditing: boolean;
  placeholder: string;
  inputProps?: any;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const EditableField = ({
  value,
  onChangeDraft,
  isEditing,
  placeholder = "Digite um valor...",
  inputProps = {},
  style,
  inputStyle
}: EditableTableProps) => {

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    onChangeDraft(newValue);
  };

  if (isEditing) {
    return (
      <Input
        disableUnderline
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus
        sx={{
          backgroundColor: "var(--neutral-200)",
          borderRadius: '10px',
          ...inputStyle
        }}
        {...inputProps}
      />
    );
  }

  return (
    <div
      style={{
        width: "auto",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--neutral-500)",
        fontWeight: "var(--fontWeightMedium)",
        ...style,
      }}
    >
      <span>{value || placeholder}</span>
    </div>
  );
};

export default EditableField;
