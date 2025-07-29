import styled from "styled-components";

interface MainTemplateStyledProps {
  isOpen?: boolean;
}

export const MainContainer = styled.div<MainTemplateStyledProps>`
  height: calc(100vh - 64px);
  overflow-y: auto;
  width: 100%;
  @media (max-width: 1200px) {
    transition: background-color 0.3s ease-in-out;
  }
`;
