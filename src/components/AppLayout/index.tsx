import React, { useState } from "react";
import {
  ContentContainer,
  DrawerContainer,
  HeaderContainer,
  MainContainer,
} from "./styles";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Content } from "./Content";

interface MainTemplateProps {
  children: React.ReactNode;
}

export const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <MainContainer>
      <DrawerContainer>
        <Sidebar isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      </DrawerContainer>
      <HeaderContainer>
        <Header isDrawerOpen={isDrawerOpen} />
      </HeaderContainer>
      <ContentContainer>
        <Content isOpen={isDrawerOpen}>{children}</Content>
      </ContentContainer>
    </MainContainer>
  );
};
