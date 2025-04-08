import styled from "styled-components";

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 12px;
`;

export const ButtonStyle = styled.button<{ variant?: 'primary' | 'secondary' | 'tertiary' }>`
  background-color: ${({ variant }) =>
    variant === 'primary'
      ? 'var(--button-primary)'
      : variant === 'secondary'
      ? 'var(--button-secondary)'
      : 'transparent'};
  color: ${({ variant }) => variant === 'primary' ? 'var(--neutral-white)' : 'var(--neutral-800)'};
  font-size: 18px;
  font-weight: var(--fontWeightSemiBold);
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ variant }) =>
      variant === 'primary'
        ? 'var(--button-primary-hover)'
        : variant === 'secondary'
        ? 'var(--button-secondary-hover)'
        : 'var(--button-tertiary)'};
  }
`;
