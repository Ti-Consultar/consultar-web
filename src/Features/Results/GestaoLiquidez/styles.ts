import styled from "styled-components";

interface MainContainerProps {
  isOpen: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  width: 93%;
  transition: max-width 0.3s ease;
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
  max-width: 95%;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
  margin-bottom: 1rem;
`;
