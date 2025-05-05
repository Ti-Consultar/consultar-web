import styled from "styled-components";

export const MainContainer = styled.div`
  max-height: 100vh;
  overflow: auto;
  margin: 1rem;
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
  }
  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 1rem;
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

export const PageTitle = styled.span`
  color: var(--neutral-500);
  font-size: 20px;
  font-weight: var(--fontWeightBold);
  margin-bottom: 12px;

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;
