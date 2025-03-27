import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ContentContainer,
  MainContainer,
  NavButtonsContainer,
  TextContent,
  TopBar,
} from "./styles";
import LogoConsultarHorizontal from "../../../assets/images/logo-consultar-horizontal.svg";
import { LinkDefault } from "../LinkDefault";
import { ButtonDefault } from "../ButtonDefault";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useMedia } from "react-use";

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const isNotMobile = useMedia("(min-width: 1180px)");

  return (
    <MainContainer>
      <TopBar>
        <img src={LogoConsultarHorizontal} alt="Logo Consultar" />
        <NavButtonsContainer>
          {isNotMobile && (
            <LinkDefault
              text="Solicitar Demonstração"
              color="branding-default-blue"
              fontSize="12px"
              pathNavigate="/"
            />
          )}

          <ButtonDefault
            onClick={() => navigate("/login")}
            backgroundColor="branding-default-blue"
            color="neutral-50"
            icon={<ExitToAppIcon fontSize="small" />}
            text="Login"
          />
        </NavButtonsContainer>
      </TopBar>

      <ContentContainer>
        <TextContent>
          <h2>Decisões Inteligentes com Visão Ampliada de Negócios</h2>
          <p>
            Nosso sistema, desenvolvido sob o conceito de Visão Ampliada de
            Negócios, oferece uma visão dinâmica, ágil e consolidada dos dados
            contábeis, financeiros e econômicos da sua empresa. Ele proporciona
            um apoio eficaz à tomada de decisões, permitindo uma gestão mais
            estratégica e informada.
          </p>
        </TextContent>
        <ButtonDefault
          onClick={() => navigate("/login")}
          backgroundColor="branding-default-blue"
          color="neutral-50"
          text="Solicitar demonstração"
        />
      </ContentContainer>
    </MainContainer>
  );
};
