import styled from "styled-components";

export const MainContainer = styled.div`
  margin: 1rem;
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const Title = styled.h1`
  color: var(--neutral-800);
  font-size: 25px;
  font-weight: var(--fontWeightMewdium);
  margin-bottom: 15px;

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;
