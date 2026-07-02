import styled from "styled-components";

interface MainTemplateStyledProps {
  isDrawerOpen?: boolean;
}

export const MainContainer = styled.div`
  display: grid;
  grid-template-areas: "drawer main";

  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
  height: 100vh;
`;

export const ContentWrapper = styled.div<MainTemplateStyledProps>`
  grid-area: main;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

export const DrawerContainer = styled.div`
  grid-area: drawer;
`;

export const HeaderContainer = styled.div`
  flex: 0 0 auto;
`;

export const EnvironmentBanner = styled.div`
  flex: 0 0 auto;
  background-color: #ffce1b;
  color: var(--branding-dark-blue);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 8px 28px;
  text-align: center;
`;

export const ContentContainer = styled.div<MainTemplateStyledProps>`
  flex: 1 1 auto;
  background-color: var(--neutral-50);
  overflow-x: auto;
  min-height: 0;
  max-width: 100vw;
`;
