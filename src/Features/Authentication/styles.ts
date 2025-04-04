import styled from "styled-components";
import graphicBackground from "../../../src/assets/images/graphic-background.png";

export const MainContainer = styled.div`
  align-items: center;
  background-image: url(${graphicBackground});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  height: 100vh;
`;

export const LoginContainer = styled.div`
  // align-items: center;
  background-color: var(--neutral-white);
  border-radius: 24px;
  display: flex;
  flex-direction: column;

  padding: 48px 72px;
  width: 540px;

  @media (max-width: 720px) {
    margin: 2rem;
    padding: 32px 48px;
  }
`;

export const ClickableText = styled.p`
  cursor: pointer;
  color: var(${(props) => props.color || "black"});
`;

export const Logo = styled.img`
  margin: 0 auto 32px;
  width: 181px;
`;

export const Title = styled.h2`
  color: var(--branding-default-blue);
  font-size: 32px;
  font-weight: var(--fontWeightSemiBold);
  line-height: 32px;
  margin-bottom: 32px;
  text-align: center;

    @media (max-width: 720px) {
      font-size: 24px;
  }
`;

export const SubTitle = styled.h3`
  color: var(--text-gray);
  font-size: 20px;
  font-weight: var(--fontWeightMedium);
  line-height: 20px;
  margin-bottom: 32px;
  text-align: center;

    @media (max-width: 720px) {
      font-size: 18px;
  }
`;

export const InfoText = styled.p`
  color: var(--branding-default-blue);
  font-size: 18px;
  font-weight: var(--fontWeightRegular);
  line-height: 20px;
  margin-top: 32px;
  text-align: center;

    @media (max-width: 720px) {
      font-size: 16px;
  }
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ButtonSubmit = styled.div`
  margin-top: 32px;
  width: 100%;

  button {
    width: 100%;
  }
`;

export const RequestAccountContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  p {
    color: var(--neutral-500);
    margin-right: 4px;
  }
`;
