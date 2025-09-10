import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Button, useTheme, useMediaQuery } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useValueDisplay } from "../../../contexts/ValueDisplayContext";

const OPTIONS = [
  { label: "Padrão (Total)", value: "TOTAL" },
  { label: "Milhares", value: "MILHAR" },
  { label: "Milhões", value: "MILHARES" }
];

export const TableValueVisualization: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { valueMode, setValueMode } = useValueDisplay();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleChange = (mode: any) => {
    setValueMode(mode);
    handleClose();
  };

  const selectedLabel = OPTIONS.find(o => o.value === valueMode)?.label;

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          color: "#000",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          fontSize: "14px",
          border: "2px solid var(--neutral-300)"
        }}
      >
        <span>{selectedLabel?.split(" ")[0]}</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            padding: "4px 0"
          }
        }}
      >
        {OPTIONS.map(option => (
          <MenuItem
            key={option.value}
            onClick={() => handleChange(option.value)}
            sx={{ fontSize: "14px", padding: "8px 16px" }}
          >
            <ListItemIcon sx={{ minWidth: "32px" }}>
              {valueMode === option.value && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
