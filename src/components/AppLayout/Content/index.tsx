// src/components/Content.js
import React from "react";
import { MainContainer } from "./styles";

interface ContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

export const Content: React.FC<ContentProps> = ({ children, isOpen }) => {
  return <MainContainer isOpen={isOpen}>{children}</MainContainer>;
};
