import React from "react";
import {
  EnvironmentBanner,
  ContentContainer,
  DrawerContainer,
  HeaderContainer,
  MainContainer,
  ContentWrapper,
} from "./styles";
import { Header } from "./Header";
import { Content } from "./Content";
import { useDrawer } from "../../contexts/DrawerContext";
import { env } from "../../config/env";

import SidebarV2 from "./SidebarV2";

interface MainTemplateProps {
  children: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  const { isOpen } = useDrawer();

  return (
    <MainContainer>
      <DrawerContainer>
        <SidebarV2 />
      </DrawerContainer>
      <ContentWrapper isDrawerOpen={isOpen}>
        {env.isHomologation && (
          <EnvironmentBanner role="status" aria-label="Ambiente de homologação">
            Ambiente de homologação: dados e alterações são destinados a testes
            e validação.
          </EnvironmentBanner>
        )}
        <HeaderContainer>
          <Header />
        </HeaderContainer>
        <ContentContainer>
          <Content isOpen={false}>{children}</Content>
        </ContentContainer>
      </ContentWrapper>
    </MainContainer>
  );
};
