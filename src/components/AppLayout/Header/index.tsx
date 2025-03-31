import { useMainContext } from "../../../contexts/mainContext";
import { BreadcrumbsContainer, BreadcrumbsItem, MainContainer } from "./styles";
import { useEffect } from "react";

interface HeaderProps {
    isDrawerOpen: boolean;
}

export const Header = ({ isDrawerOpen }: HeaderProps) => {
    useEffect(() => {
        console.log("isDrawerOpen mudou:", isDrawerOpen);
      }, [isDrawerOpen]);

    const { navSelected } = useMainContext();
    return (
        <MainContainer isDrawerOpen={isDrawerOpen}>
            <BreadcrumbsContainer>
                <BreadcrumbsItem breadcrumbActive={true}>
                    {navSelected}/
                </BreadcrumbsItem>
            </BreadcrumbsContainer>
        </MainContainer>
    );
}