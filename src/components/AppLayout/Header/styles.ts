import styled from "styled-components";

interface HeaderPropsStyle {
    breadcrumbActive?: boolean;
    isDrawerOpen?: boolean;
}

export const MainContainer = styled.div<HeaderPropsStyle>`
  display: flex;
  align-items: center;
  background-color: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
  color: white;
  height: 56px;
  justify-content: space-between;
  padding: 14px 28px;
  max-height: fit-content;
  transition: margin-left 0.3s;
  margin-left: ${({ isDrawerOpen }) => (isDrawerOpen ? "0" : "0")};
    @media (max-width: 1200px) {
    background-color: ${({ isDrawerOpen }) => (isDrawerOpen ? `rgba(56, 51, 51, 0.59)` : `rgba(0, 0, 0, 0)`)};
    transition: background-color 0.3s ease-in-out;
  }
`;

export const BreadcrumbsContainer = styled.div`
  display: flex;
  gap: 16px;
  p {
    color: var(--neutral-400);
  }
`;

export const BreadcrumbsItem = styled.a<HeaderPropsStyle>`
  color: ${({ breadcrumbActive }) => breadcrumbActive ? "var(--branding-dark-blue)" : "var(--neutral-400)"};
  cursor: pointer;
  text-decoration: none;
`;
