import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 24px 50px;
  background-color: var(--neutral-white);
  height: 100%;

  @media (max-width: 1195px) {
    padding: 24px;
  }
`;

export const Title = styled.h1`
  color: var(--neutral-800);
  font-size: 1.8rem;
  font-weight: var(--fontWeightBold);
  margin-bottom: 12px;

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;
