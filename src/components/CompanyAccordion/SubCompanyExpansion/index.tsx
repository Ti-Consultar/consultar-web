import { SubCompaniesContainer, SubCompanyContainer, Text } from "./styles";

interface SubCompanyProps {
    subCompanies: any[];
}

export const SubCompany = ({ subCompanies }: SubCompanyProps) => {
    return (
        <SubCompaniesContainer>
            {subCompanies?.map(subCompany => (
                <SubCompanyContainer key={subCompany.subCompanyId}>
                    <Text>{subCompany.subCompanyName}</Text>
                </SubCompanyContainer>
            ))}
        </SubCompaniesContainer>
    );
}
