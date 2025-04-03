import styled from 'styled-components';

interface MainTemplateStyledProps {
  isOpen?: boolean;
}

export const MainContainer = styled.div<MainTemplateStyledProps>`
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  max-height: 90dvh;
  @media (max-width: 1200px) {
    overflow-x: hidden;
    transition: background-color 0.3s ease-in-out;
  }
`;
