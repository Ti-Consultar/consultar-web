import { Input } from "@mui/material";
import { useState, useEffect } from "react";

interface EditableTableProps {
  value: string;
  onChangeDraft: (changeValue: string) => void;
  isEditing: boolean;
  placeholder: string;
  inputProps?: any;
}

const EditableField = ({
  value,
  onChangeDraft,
  isEditing,
  placeholder = "Digite um valor...",
  inputProps = {},
}: EditableTableProps) => {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    setDraft(newValue);
    onChangeDraft(newValue);
  };

  if (isEditing) {
    return (
      <Input
        disableUnderline
        sx={{ maxWidth: "50%" }}
        type="text"
        value={draft}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus
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
      }}
    >
      <span>{value || placeholder}</span>
    </div>
  );
};

export default EditableField;
