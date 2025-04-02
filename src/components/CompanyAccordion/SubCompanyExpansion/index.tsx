import { SubCompaniesContainer, SubCompanyContainer, Text } from "./styles";

interface SubCompanyProps {
    subCompany: string;
}

export const SubCompany = ({ subCompany }: SubCompanyProps) => {
    return (
        <SubCompaniesContainer>
            <SubCompanyContainer key={subCompany}>
                <Text>{subCompany}</Text>
            </SubCompanyContainer>
        </SubCompaniesContainer>
    );
}
