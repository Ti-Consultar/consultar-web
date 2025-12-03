import { List } from "@mui/material";
import styled from "styled-components";

export const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? "64px" : "240px")};
  transition: width 0.3s ease;
  background-color: #fff;
  border-right: 1px solid #eee;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const SectionTitle = styled.div<{ collapsed: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: #888;
  margin: 16px 16px 8px;
  text-transform: uppercase;
  height: 16px;
  visibility: ${({ collapsed }) => (collapsed ? "hidden" : "visible")};
`;

export const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;