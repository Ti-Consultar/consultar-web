import styled from "styled-components";
import loginImage from "../../../src/assets/images/login-side.png";
import { FormHelperText } from "@mui/material";

export const LoginGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // Duas colunas lado a lado
  height: 100vh;
  width: 100vw;

  @media (max-width: 720px) {
    grid-template-columns: 1fr; // <-- aqui você define só uma coluna
  }
`;

export const MainContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--neutral-200);
  background-size: cover;
  background-repeat: no-repeat;
  justify-content: center;
  height: 100vh;
`;

export const LoginContainer = styled.div`
  background-color: var(--neutral-white);
  display: flex;
  flex-direction: column;

  padding: 32px 72px;

  @media (max-width: 720px) {
    margin: 2rem;
    border-radius: 24px;
    padding: 32px 48px;
  }
`;

export const ContentContainer = styled.div`
  background-image: url(${loginImage});
  display: { xs: "none", md: "flex" };

  padding: 24px 24px;

    @media (max-width: 720px) {
    display: none; // Oculta no mobile
  }
`;

export const LoginContent = styled.div`
  display: flex,
  flex-direction: column,
  height: 100%,
`;

export const CustomFormHelperText = styled(FormHelperText)`
  margin-left: 0 !important;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;

  padding: 32px;
`;

export const LogoWhite = styled.img`
  width: 32px;
`;

export const ClickableText = styled.p`
  cursor: pointer;
  color: var(${(props) => props.color || "black"});
`;

export const Logo = styled.img`
  margin: 0 auto 32px;
  width: 230px;
`;

export const Title = styled.h2`
  color: var(--neutral-700);
  font-size: 28px;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 32px;

  @media (max-width: 720px) {
    font-size: 24px;
  }
`;

export const SubTitle = styled.span`
  color: var(--text-gray);
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 32px;

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

export const Text = styled.p`
  color: var(--neutral-white);
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 20px;
  margin-top: 32px;
  margin-bottom: 1.5rem;

  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

export const SubText = styled.span`
  color: var(--neutral-300);
  font-size: 1.2rem;
  font-weight: 200;

  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

export const Copyright = styled.span`
  color: var(--neutral-500);
  font-size: 1rem;
  font-weight: 300;

  @media (max-width: 720px) {
    font-size: 16px;
  }
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0px 40px
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
