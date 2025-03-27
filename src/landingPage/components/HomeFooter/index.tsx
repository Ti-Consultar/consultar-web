import {
  ContentContainer,
  HorizontalLogo,
  MainContainer,
  Nav,
  NewsletterContainer,
  NewsletterForm,
} from "./styles";
import LogoConsultarHorizontal from "../../../assets/images/logo-consultar-horizontal.svg";
import { Link } from "react-router-dom";

export const HomeFooter: React.FC = () => {
  return (
    <MainContainer>
      <ContentContainer>
        <HorizontalLogo
          src={LogoConsultarHorizontal}
          alt="Consultar logo horizontal"
        />
        <Nav>
          <Link to="/">Início</Link>
          <Link to="/">Solicitar Demonstração</Link>
          <Link to="/">Dúvidas Frequentes</Link>
          <Link to="/">Blog</Link>
        </Nav>
        <NewsletterContainer>
          <h4>Cadastre-se em nossa newsletter</h4>
          <NewsletterForm>
            <input type="text" placeholder="E-mail" />
            <button>Inscrever-se</button>
          </NewsletterForm>
        </NewsletterContainer>
      </ContentContainer>
    </MainContainer>
  );
};
