import { TableCell, TableRow } from "@mui/material";
import styled from "styled-components";
import theme from "../../../styles/theme";

const Z = {
  body: 1,
  bodyFirst: 10,
  head: 20,
  headFirst: 30,
};

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.5rem;

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
  margin-bottom: 1rem;
`;

export const StickyTableCell = styled(TableCell)<{
  isHovered?: boolean;
  isSection?: boolean;
  isFocusedCell?: boolean;
}>`
  position: sticky;
  left: 0;
  z-index: ${Z.bodyFirst};
  background-color: ${({ isFocusedCell, isHovered, isSection }) => {
    if (isFocusedCell) return "#d7d9eeff";
    if (isHovered) return "#eaeaeaff";
    if (isSection) return "#f4f4f4";
    return "white";
  }};
  font-weight: ${({ isSection }) => (isSection ? "bold" : "normal")};
  border: 1px solid rgba(224, 224, 224, 1);
  background-clip: padding-box;
`;

export const StyledTableCell = styled(TableCell)<{
  isHovered?: boolean;
  isSection?: boolean;
  isFocusedCell?: boolean;
}>`
  z-index: ${Z.body};
  background-color: ${({ isFocusedCell, isHovered, isSection }) => {
    if (isFocusedCell) return "#d7d9eeff";
    if (isHovered) return "#eaeaeaff";
    if (isSection) return "#f4f4f4";
    return "transparent";
  }};
  font-weight: ${({ isSection }) => (isSection ? "bold" : "normal")};
  border: 1px solid rgba(224, 224, 224, 1);
  background-clip: padding-box;
`;

export const StickyHeaderCell = styled(StickyTableCell)`
  top: 0;
  z-index: ${Z.headFirst};
  font-weight: bold;
  background-color: #d7d9eeff;
`;

export const HoverableTableRow = styled(TableRow)<{
  isSection?: boolean;
}>`
  background-color: ${({ isSection }) =>
    isSection ? "#d7d9eeff" : "transparent"};

  &:hover {
    background-color: ${theme.palette.action.hover};
  }
`;

export const StickyHead = {
  position: "sticky" as const,
  top: 0,
  backgroundColor: theme.palette.grey[200],
  zIndex: Z.head,
  fontWeight: "bold",
  backgroundClip: "padding-box",
  transform: "translateZ(0)",
};

export const StickyHeadFirstCell = {
  ...StickyHead,
  left: 0,
  zIndex: Z.headFirst,
  minWidth: 260,
};

export const StickyCell = {
  position: "sticky" as const,
  left: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: Z.bodyFirst,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundClip: "padding-box",
};
