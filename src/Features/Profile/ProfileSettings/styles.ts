import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  border-radius: 15px;
  width: 98%;
  height: 100%;
  background-color: var(--neutral-white);
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
  }

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
