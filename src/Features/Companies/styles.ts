import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 24px 50px;

  @media (max-width: 1195px) {
    width: 90%;
    padding: 24px;
  }
`;

export const Title = styled.h1`
  color: var(--neutral-800);
  font-size: 32px;
  font-weight: var(--fontWeightBold);
  margin-bottom: 12px;

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;
