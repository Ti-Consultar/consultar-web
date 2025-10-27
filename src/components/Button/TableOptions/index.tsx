import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";

const STORAGE_KEY = "showBudgetColumns";

interface BudgetToggleButtonProps {
  showBudgetColumns: boolean;
  setShowBudgetColumns: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BudgetToggleButton: React.FC<BudgetToggleButtonProps> = ({
  showBudgetColumns,
  setShowBudgetColumns,
}) => {
  const handleToggle = () => {
    const newValue = !showBudgetColumns;
    setShowBudgetColumns(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  };

  return (
    <Button
      variant="text"
      size="small"
      onClick={handleToggle}
      startIcon={
        showBudgetColumns ? (
          <VisibilityOffIcon sx={{ color: "#4361EE" }} />
        ) : (
          <VisibilityIcon color="inherit" />
        )
      }
      sx={{
        color: showBudgetColumns ? "#4361EE" : "inherit",
        textTransform: "none",
      }}
    >
      {showBudgetColumns ? "Ocultar Orçamento" : "Mostrar Orçamento"}
    </Button>
  );
};
