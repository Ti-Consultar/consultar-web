import styled from 'styled-components';

export const MainContainer = styled.div`
  display: grid;
  grid-template-areas:
    'drawer header'
    'drawer content';

  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
`;

export const DrawerContainer = styled.div`
  grid-area: drawer;
`;

export const HeaderContainer = styled.div`
  grid-area: header;
`;

export const ContentContainer = styled.div`
  grid-area: content;
  background-color: var(--neutral-50);
  overflow-x: auto;
  max-width: 100vw;
`;
