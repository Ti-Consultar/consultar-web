import { NavLink } from "react-router-dom";
import styled from "styled-components";

interface LinkDefaultStyledProps {
  color: string;
  fontSize: string;
}

export const Link = styled(NavLink)<LinkDefaultStyledProps>`
  color: ${({ color }) => `var(--${color})`};
  font-size: ${({ fontSize }) => fontSize};
  line-height: 20px;
`;
