import styled from "styled-components";

interface ButtonStyledProps {
  backgroundColor: string;
  color: string;
}

export const Button = styled.button<ButtonStyledProps>`
  align-items: center;
  display: flex;
  background-color: ${({ backgroundColor }) => `var(--${backgroundColor})`};
  border: none;
  border-radius: 100px;
  color: ${({ color }) => `var(--${color})`};
  font-size: 16px;
  gap: 8px;
  padding: 10px 24px;
  justify-content: center;

  transition: filter 0.2s;
  &:hover {
    cursor: pointer;
    filter: brightness(0.7);
  }
`;
