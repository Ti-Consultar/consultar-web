import styled from "styled-components";

export const MainContainer = styled.div`
  max-height: 100vh;
  margin: 1rem;
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 95%;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
`;

export const Subtitle = styled.span`
  font-size: 24px;
`;
