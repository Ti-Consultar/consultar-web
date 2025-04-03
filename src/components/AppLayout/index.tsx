import React from "react";
import {
  ContentContainer,
  DrawerContainer,
  HeaderContainer,
  MainContainer,
  ContentWrapper
} from "./styles";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Content } from "./Content";
import { useDrawer } from "../../contexts/SidebarProvider";

interface MainTemplateProps {
  children: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
    const { isDrawerOpen } = useDrawer();

  return (
    <MainContainer>
      <DrawerContainer>
        <Sidebar />
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
