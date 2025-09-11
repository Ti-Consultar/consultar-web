import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  margin: 1.5rem;
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
  }
  @media (max-width: 767px) {
    padding: 0.7rem;
    margin: 0;
  }
`;

export const HeaderContainer = styled.div`
  background-color: var(--neutral-white);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
  padding: 1rem;
  width: 100%;
  margin-bottom: 1rem;
`;

export const FileSearchImg = styled.img`
  margin: 0 auto 32px;
  width: 70px;
`;

export const ListContainer = styled.div`
  background-color: var(--neutral-white);
  border-radius: 8px;
  border: 1px solid var(--neutral-200);
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 70vh
`;

export const Title = styled.h2`
  font-size: 20px;
  color: var(--neutral-700);
`;

export const Subtitle = styled.span`
  font-size: 16px;
  color: var(--neutral-500);
  margin-bottom: 0.5rem;
  text-align: center
`;

export const OptionsContainer = styled.div`
  dsplay: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
`
