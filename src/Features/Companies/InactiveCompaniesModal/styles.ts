import { Box, TextField } from "@mui/material";
import styled from "styled-components";

export const ModalContainer = styled.div`
  display: flex;
`;

export const ModalBox = styled(Box)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  backgroundColor: "var(--neutral-white)",
  padding: "2rem",
  borderRadius: "10px",
}));

export const SearchInput = styled(TextField)(() => ({
  width: "40%",
  backgroundColor: "#fff",
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
  },
}));

export const EmptyStateBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
}));
