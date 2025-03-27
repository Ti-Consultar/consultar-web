import {
  BenefictsText,
  BenefitsContainer,
  CardsContainer,
  CheckmarkItem,
  CheckmarksList,
  InfoCard,
  MainContainer,
  Subtitle,
  Title,
} from "./styles";
import psychology from "../../../assets/icons/psychology.svg";
import barChart from "../../../assets/icons/bar-chart.svg";
import shield from "../../../assets/icons/shield.svg";
import computer from "../../../assets/icons/computer.svg";
import checkmarkIcon from "../../../assets/icons/checkmark.svg";

import { ButtonDefault } from "../ButtonDefault";
import { useNavigate } from "react-router-dom";
import { useMedia } from "react-use";

export const AboutProduct: React.FC = () => {
  const dataCards = [
    {
      icon: psychology,
      title: "Módulo inteligente",
      text: "Analisa vários dados, financeiros e econômicos, todos na mesma plataforma.",
    },
    {
      icon: barChart,
      title: "Dashboard",
      text: "Proporciona uma fácil leitura e objetiva dos indicadores da empresa. Potencializando as forças da organização no auxílio na tomada de decisões.",
    },
    {
      icon: shield,
      title: "Segurança dos dados ",
      text: "Plataforma 100% segura e garante confidencialidade das informações da sua empresa.",
    },
    {
      icon: computer,
      title: "Acessível de qualquer lugar",
      text: "O MRP Consultar é um sistema Web. Não precisa de instalação, basta ter acesso a internet e abrir o seu navegador de qualquer dispositivo eletrônico (computadores, tablets e celulares)",
    },
  ];

  const dataCheckmarks = [
    {
      text: "Melhor análise para tomada de decisões;",
    },
    {
      text: "Melhor comparabilidade dos resultados;",
    },
    {
      text: "Indicadores econômicos e financeiros unificados.",
    },
    {
      text: "Aumento de produtividade;",
    },
    {
      text: "Redução do número de inconsistências em processos;",
    },
    {
      text: "Maior agilidade nas identificações das oportunidades.",
    },
  ];

  const navigate = useNavigate();
  const isNotMobile = useMedia("(min-width: 1180px)");

  return (
    <MainContainer>
      <Title>Sobre o produto</Title>
      <Subtitle>
        Uma ferramenta estratégica que oferece aos gestores uma visão precisa do
        desempenho da empresa, focada na Geração de Caixa Contínua e na
        Eficiência Operacional e Financeira, utilizando conceitos, técnicas,
        demonstrativos e indicadores de desempenho.
      </Subtitle>
      <CardsContainer>
        {dataCards.map((card) => {
          return (
            <InfoCard>
              <img src={card.icon} alt="" className="icon" />
              <h3 className="title">{card.title} </h3>
              <p className="text"> {card.text} </p>
            </InfoCard>
          );
        })}
      </CardsContainer>
      <ButtonDefault
        onClick={() => navigate("/login")}
        backgroundColor="branding-default-blue"
        color="neutral-50"
        text="Solicitar demonstração"
      />
      {isNotMobile && (
        <BenefitsContainer>
          <BenefictsText>
            Maximização e Controle da Eficiência Operacional;
          </BenefictsText>
          <CheckmarksList>
            {dataCheckmarks.map((checkmark) => {
              return (
                <CheckmarkItem>
                  <img src={checkmarkIcon} alt="" />
                  <p>{checkmark.text}</p>
                </CheckmarkItem>
              );
            })}
          </CheckmarksList>
        </BenefitsContainer>
      )}
    </MainContainer>
  );
};
