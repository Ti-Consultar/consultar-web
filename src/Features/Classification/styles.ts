import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2.5rem;
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
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 70vh
`;

export const Title = styled.h2`
  font-size: 24px;
  color: var(--neutral-700);
`;
