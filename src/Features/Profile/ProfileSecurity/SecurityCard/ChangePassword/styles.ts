import styled from "styled-components";

export const SecurityCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid var(--neutral-300);
  background-color: var(--neutral-white);
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const Title = styled.p(() => ({
  fontWeight: 'var(--fontWeightBold)',
  fontSize: '18px',
  color: "var(--neutral-700)",
  marginBottom: '1rem'
}));

export const SubTitle = styled.span(() => ({
  fontWeight: 'var(--fontWeightMedium)',
  fontSize: '16px',
  color: "var(--neutral-500)",
  marginBottom: '1rem'
}));

export const ForgotPassword = styled.span(() => ({
  fontWeight: 'var(--fontWeightBold)',
  fontSize: '16px',
  color: "var(--branding-default-blue)",
  cursor: 'pointer'
}));
