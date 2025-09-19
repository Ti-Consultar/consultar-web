import styled from "styled-components";

interface MainTemplateStyledProps {
  isDrawerOpen?: boolean;
}

export const MainContainer = styled.div`
  display: grid;
  grid-template-areas:
    "drawer header"
    "drawer content";

  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  height: 100vh;
`;

export const ContentWrapper = styled.div<MainTemplateStyledProps>`
  overflow: hidden;
`;

export const DrawerContainer = styled.div`
  grid-area: drawer;
`;

export const HeaderContainer = styled.div`
  grid-area: header;
`;

export const ContentContainer = styled.div<MainTemplateStyledProps>`
  grid-area: content;
  background-color: var(--neutral-50);
  overflow-x: auto;
  max-width: 100vw;
`;
