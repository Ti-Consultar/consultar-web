import { ListItemText } from "@mui/material";
import styled from "styled-components";

export const ListItemCustom = styled(ListItemText)(() => ({
  cursor: "pointer",
  color: "var(--neutral-500)",
  padding: "5px 12px",
  borderRadius: "10px",
  "&:hover": {
    backgroundColor: "var(--neutral-150)",
    transition: "transform 0.5s, box-shadow 0.5s ease-in-out",
  },
}));
