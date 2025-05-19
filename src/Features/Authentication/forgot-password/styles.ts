import styled from "styled-components";
import loginImage from "../../../../src/assets/images/dark-background-login.png";

export const ContentContainer = styled.div`
  background-image: url(${loginImage});
  display: { xs: "none", md: "flex" };

  padding: 24px 24px;

  @media (max-width: 720px) {
    display: none; // Oculta no mobile
  }
`;
