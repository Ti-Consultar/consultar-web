import { Avatar, Box, Card } from "@mui/material";
import styled from "styled-components";

export const StyledCard = styled(Card)(() => ({
  width: "100%",
  minWidth: 250,
  minHeight: 160,
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  position: "relative",
  border: "1px solid #EBEBEB",
  transition: "all .2s ease",
  boxShadow: "none",

  "&:hover": {
    borderColor: "#1976d2",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",

    ".card-menu-button": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

export const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

export const StyledAvatar = styled(Avatar)(() => ({
  backgroundColor: "#E1F5EE",
  borderRadius: "12px",
  width: 40,
  height: 40,
  fontSize: "13px",
  color: "#085041",
}));

export const CardActionsBox = styled(Box)(() => ({
  position: "absolute",
  top: 10,
  right: 10,
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  display: "flex",
  gap: 4,
  zIndex: 1,

  ".MuiCard-root:hover &": {
    opacity: 1,
  },

  "@media (max-width: 600px)": {
    opacity: 1,
  },
}));
