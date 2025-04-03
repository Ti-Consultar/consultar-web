import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 24px 50px;

  @media (max-width: 1195px) {
    padding: 24px;
  }
`;

export const Title = styled.h1`
  color: var(--branding-default-blue);
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

export const ButtonTittle = styled.h1`
  color: var(--neutral-white);
  font-size: 18px;
  font-weight: var(--fontWeightMedium);
`;  

export const SubTitle = styled.h1`
  color: var(--neutral-800);
  font-size: 20px;
  font-weight: var(--fontWeightRegular);

  span {
    font-weight: var(--fontWeightRegular);
  }

    @media (max-width: 1195px) {
    font-size: 18px;
  }
`;

export const HeaderListBoxContents = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr 1fr;
`;

export const BoxContent = styled.div`
  align-items: center;
  background-color: var(--neutral-white);
  border-radius: 16px;
  box-shadow: 0px 3px 6px 0px #0000001a;
  color: var(--branding-default-blue);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(0.9);
  }

  p {
    font-size: 24px;
    font-weight: var(--fontWeightBold);
  }
`;
