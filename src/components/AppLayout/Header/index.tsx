import { useMainContext } from "../../../contexts/mainContext";
import { BreadcrumbsContainer, BreadcrumbsItem, MainContainer } from "./styles";

export const Header = () => {

    const { navSelected } = useMainContext();
    return (
        <MainContainer>
            <BreadcrumbsContainer>
                <BreadcrumbsItem breadcrumbActive={true}>
                    {navSelected}/
                </BreadcrumbsItem>
            </BreadcrumbsContainer>
        </MainContainer>
    );
}