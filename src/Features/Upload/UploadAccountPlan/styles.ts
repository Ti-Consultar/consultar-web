import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  padding: 1.5rem;

  @media (max-width: 767px) {
    padding: 0.75rem;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
  padding: 1.5rem;
  background-color: var(--neutral-white);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;

  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const ContentContainer = styled.section`
  width: 100%;
  min-width: 0;
  padding: 1.5rem;
  background-color: var(--neutral-white);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: var(--neutral-700);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
`;

export const PageSubtitle = styled.p`
  margin: 0.25rem 0 0;
  color: var(--neutral-500);
  font-size: 0.9375rem;
  line-height: 1.5;
`;
