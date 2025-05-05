import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  gap: 5;
  margin: 5%;
  width: 100%;
  justify-content: space-between;
`;

export const Title = styled.div`
  color: var(--neutral-700);
  font-size: 20px;
  font-weight: var(--fontWeightBold);
  margin-bottom: 12px;

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;
