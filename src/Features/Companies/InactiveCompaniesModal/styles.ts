import { Box, TextField } from "@mui/material";
import styled from "styled-components";

// Container principal do modal (com flexbox vertical)
export const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background-color: var(--neutral-white);
  padding: 2rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

// Área scrollável da tabela + conteúdo
export const ModalContentBox = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 1rem;
`;

// Input de busca
export const SearchInput = styled(TextField)`
  width: 100%;
  max-width: 300px;
  background-color: #fff;

  .MuiOutlinedInput-root {
    border-radius: 10px;
  }
`;

// Estado vazio da tabela
export const EmptyStateBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;
