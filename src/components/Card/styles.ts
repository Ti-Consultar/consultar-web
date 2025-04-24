import { Avatar, Box, Card } from "@mui/material";
import styled from "styled-components";

export const StyledCard = styled(Card)(() => ({
  width: "100%",
  maxWidth: 320,
  minWidth: 250,
  padding: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  position: "relative", // importante para o posicionamento absoluto funcionar
  '&:hover': {
    backgroundColor: '#f2f2f2',
    transform: 'scale(1.02)',
    transition: 'transform 0.3s, box-shadow 0.3s ease-in-out',
  },
  '&:hover .card-actions': {
    opacity: 1,
  },
}));

export const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

export const StyledAvatar = styled(Avatar)(() => ({
  backgroundColor: "#f2f2f2",
  width: 48,
  height: 48,
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

  // Quando o card for hover, mostra os botões
  '.MuiCard-root:hover &': {
    opacity: 1,
  },

  // No mobile (largura até 600px), os botões estão sempre visíveis
  '@media (max-width: 600px)': {
    opacity: 1,
  },
}));
