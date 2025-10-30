import styled from "styled-components";

export const Title = styled.h1`
  color: var(--neutral-800);
  font-size: 25px;
  font-weight: var(--fontWeightMewdium);
  margin-bottom: 15px;
  margin-left: 15px;
  margin-top: 1rem;

  span {
    font-weight: var(--fontWeightRegular);
  }

  @media (max-width: 1195px) {
    font-size: 24px;
  }
`;

export const MainContainer = styled.div`
  display: flex;
  border-radius: 15px;
  height: 100%;
  margin: 1rem;
  background-color: var(--neutral-white);

  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-white);
`;

export const SectionTitle = styled.p(() => ({
  fontWeight: 'var(--fontWeightBold)',
  fontSize: '24px',
  color: "var(--neutral-700)",
  marginBottom: '1rem'
}));

export const SectionTypography = styled.p(() => ({
  fontWeight: 'var(--fontWeightBold)',
  fontSize: '18px',
  color: "var(--neutral-700)",
  marginBottom: '1rem'
}));
