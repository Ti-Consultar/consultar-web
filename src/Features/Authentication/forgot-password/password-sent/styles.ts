import styled from "styled-components";

export const SentImg = styled.img`
  margin: 0 auto 32px;
  width: 128px;
`;

export const Container = styled.div`
  background-color: var(--neutral-white);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  max-width: 50%;

  padding: 32px 72px;

  @media (max-width: 720px) {
    margin: 2rem;
    padding: 32px 48px;
  }
`;
