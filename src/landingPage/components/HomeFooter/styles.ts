import styled from "styled-components";

export const MainContainer = styled.div`
  background-color: var(--neutral-white);
  box-shadow: 0px -3px 6px 0px #0000001a;
  display: flex;
  justify-content: center;
  padding: 80px 0;

  @media (max-width: 1180px) {
    margin-top: 72px;
  }

  @media (max-width: 945px) {
    padding: 24px 0;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 1180px) {
    gap: 0;
    padding: 0 16px;
  }

  @media (max-width: 945px) {
    flex-direction: column;
    gap: 36px;
  }
`;

export const HorizontalLogo = styled.img`
  padding: 0 62px;

  @media (max-width: 945px) {
    margin: 0 auto;
    padding: 0;
  }
`;

export const Nav = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 261px;
  a {
    color: var(--text-gray);
    display: block;
    font-size: 16px;
    line-height: 18.75px;
    letter-spacing: -0.03em;
    text-decoration: none;
  }
`;

export const NewsletterContainer = styled.div`
  flex: 1;
  h4 {
    color: var(--branding-default-blue);
    font-size: 21px;
    font-weight: var(--fontWeightBold);
    line-height: 24px;
    margin-bottom: 24px;
  }
`;

export const NewsletterForm = styled.div`
  display: flex;

  input {
    background-color: var(--neutral-100);
    border: none;
    display: block;
    flex: 1;
    font-size: 16px;
    font-weight: var(--fontWeightMedium);
    line-height: 26px;
    letter-spacing: -0.02em;
    outline: none;
    padding: 16px;

    ::placeholder {
      color: #181433;
    }
  }

  button {
    background-color: var(--branding-default-blue);
    border: none;
    color: var(--neutral-white);
    font-size: 16px;
    font-weight: var(--fontWeightMedium);
    line-height: 26px;
    letter-spacing: -0.02em;
    padding: 16px;
    text-align: center;

    transition: filter 0.2s;
    &:hover {
      cursor: pointer;
      filter: brightness(0.7);
    }
  }
`;
