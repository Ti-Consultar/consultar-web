import { TableCell, TableRow } from "@mui/material";
import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2.5rem;
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const Container = styled.div`
  background-color: var(--neutral-white);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
  margin-bottom: 1rem
`;
export const StickyTableCell = styled(TableCell)<{
  isHovered?: boolean;
  isSection?: boolean;
  isFocusedCell?: boolean;
}>`
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: ${({ isFocusedCell, isHovered, isSection }) => {
    if (isFocusedCell) return "#d7d9eeff";
    if (isHovered) return "#eaeaeaff";
    if (isSection) return "#f4f4f4";
    return "white";
  }};
  font-weight: ${({ isSection }) => (isSection ? "bold" : "normal")};
  border: 1px solid rgba(224, 224, 224, 1);
`;

export const StyledTableCell = styled(TableCell)<{
  isHovered?: boolean;
  isSection?: boolean;
  isFocusedCell?: boolean;
}>`
  background-color: ${({ isFocusedCell, isHovered, isSection }) => {
    if (isFocusedCell) return "#d7d9eeff"; // célula em foco
    if (isHovered) return "#eaeaeaff"; // hover X/Y
    if (isSection) return "#f4f4f4"; // seção
    return "transparent";
  }};
  font-weight: ${({ isSection }) => (isSection ? "bold" : "normal")};
  border: 1px solid rgba(224, 224, 224, 1);
`;

export const StickyHeaderCell = styled(StickyTableCell)`
  z-index: 2;
  font-weight: bold;
  background-color: #d7d9eeff
`;

export const HoverableTableRow = styled(TableRow)<{ isSection?: boolean }>`
  background-color: ${({ isSection }) =>
    isSection ? "#d7d9eeff" : "transparent"};
  &:hover {
    background-color: #f9f9f9;
  }
`;
