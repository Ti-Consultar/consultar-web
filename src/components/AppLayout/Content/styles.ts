import styled from 'styled-components';

interface MainTemplateStyledProps {
  isOpen?: boolean;
}

export const MainContainer = styled.div<MainTemplateStyledProps>`
  height: 100vh;
  overflow-x: auto;
  min-width: 1200px;
  overflow-x: auto;
  @media (max-width: 1200px) {
    background-color: ${({ isOpen }) => (isOpen ? `rgba(56, 51, 51, 0.59)` : `rgba(0, 0, 0, 0)`)};
    transition: background-color 0.3s ease-in-out;
  }
`;
