import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  border-radius: 15px;
  height: 100%;
  background-color: var(--neutral-white);

  @media (max-width: 767px) {
    width: 100%;
    padding: 0.7rem;
    margin: 0;
  }
`;

export const Title = styled.p(() => ({
  fontWeight: 'var(--fontWeightBold)',
  fontSize: '24px',
  color: "var(--neutral-700)",
  marginBottom: '1rem'
}));
