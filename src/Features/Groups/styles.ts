import { Grid2 } from "@mui/material";
import styled from "styled-components";

export const MainContainer = styled.div`
  padding: 24px 50px;
  background: var(--neutral-50);

  @media (max-width: 1195px) {
    padding: 24px;
  }
`;

export const EmptyStateContainer = styled.div`
  padding: 24px 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;

  @media (max-width: 1195px) {
    padding: 24px;
  }
`;

export const NoItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--neutral-100);
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin-bottom: 8px;

  color: var(--neutral-500);
`;

export const Title = styled.h1`
  color: var(--neutral-800);
  font-size: 32px;
  font-weight: var(--fontWeightBold);
  margin-bottom: 12px;

  span {
    font-weight: var(--fontWeightRegular);
    color: var(--neutral-500);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;

export const ButtonTittle = styled.span`
  color: var(--neutral-white);
  font-size: 14px;
  font-weight: var(--fontWeightMedium);
`;

export const SubTitle = styled.span`
  display: block;
  margin-bottom: 18px;
  color: var(--neutral-500);
  font-size: 16px;
  font-weight: var(--fontWeightRegular);

  @media (max-width: 1195px) {
    font-size: 14px;
  }
`;

export const HeaderListBoxContents = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const BoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  padding: 20px;
  border-radius: 16px;

  background-color: var(--neutral-white);
  color: var(--branding-default-blue);

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08);
  }

  p {
    font-size: 22px;
    font-weight: var(--fontWeightBold);
    color: var(--neutral-800);
  }

  span {
    font-size: 14px;
    color: var(--neutral-500);
  }
`;

export const CardsContainer = styled(Grid2)(() => ({
  marginLeft: "50px",
  marginRight: "50px",

  "@media (max-width: 1195px)": {
    margin: "0 8px",
  },
}));

export const Greetings = styled.h1`
  font-size: 20px;
  font-weight: var(--fontWeightMedium);
  color: var(--neutral-800);
`;

export const GreetingsSubTitle = styled.span`
  font-size: 14px;
  font-weight: var(--fontWeightRegular);
  color: var(--neutral-500);
`;
