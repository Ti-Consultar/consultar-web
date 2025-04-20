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
  cursor : "pointer",
  '&:hover': {
    backgroundColor: '#f2f2f2',
    transform: 'scale(1.03)', 
    transition: 'transform 0.3s, box-shadow 0.3s ease-in-out', 
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
