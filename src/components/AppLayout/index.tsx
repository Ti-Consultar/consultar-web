import React from "react";
import {
  ContentContainer,
  DrawerContainer,
  HeaderContainer,
  MainContainer,
  ContentWrapper,
} from "./styles";
import { Header } from "./Header";
import { Content } from "./Content";
import { useDrawer } from "../../contexts/SidebarProvider";
import SidebarV2 from "./SidebarV2";

interface MainTemplateProps {
  children: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  const { isDrawerOpen } = useDrawer();

  return (
    <MainContainer>
      <DrawerContainer>
        <SidebarV2 />
      </DrawerContainer>
      <ContentWrapper isDrawerOpen={isDrawerOpen}>
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
