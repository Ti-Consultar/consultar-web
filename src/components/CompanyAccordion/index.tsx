import ApartmentIcon from '@mui/icons-material/Apartment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { ContentContainer, MainContainer, Title, Button, CompanyButton } from './styles';
import { useState } from 'react';
import { ButtonTittle } from '../../Features/Home/styles';
import { SubCompany } from './SubCompanyExpansion';

interface CompanyAccordionProps {
    hasSubCompanies?: boolean;
    company: {
        companyId: number;
        companyName: string;
        dateCreate: string;
        subCompanies: any[];
        permission: {
            id: number;
            name: string;
        };
    };
}

export const CompanyAccordion = ({ hasSubCompanies, company }: CompanyAccordionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <MainContainer onClick={() => setIsExpanded(!isExpanded)}>
                <ContentContainer>
                    <ApartmentIcon fontSize='large' sx={{ color: "#fff" }} />
                    <Title>{company.companyName}</Title>
                </ContentContainer>
                <ContentContainer>
                    {hasSubCompanies ? <CompanyButton onClick={(e) => e.stopPropagation()}>
                        <ButtonTittle>
                            <p>Gerenciar</p>
                        </ButtonTittle>
                    </CompanyButton>
                        : null}
                    {
                        Array.isArray(company.subCompanies) && company.subCompanies.length > 0 ?
                            <Button isExpanded={isExpanded}>
                                <KeyboardArrowDownIcon fontSize='large' sx={{ color: isExpanded ? "#6296e9" : "#fff" }}></KeyboardArrowDownIcon>
                            </Button>
                            : null
                    }
                </ContentContainer>
            </MainContainer>
            {
                Array.isArray(company.subCompanies) && company.subCompanies.length > 0 && isExpanded ?
                    <SubCompany subCompanies={company.subCompanies} />
                    : null
            }
        </>
    );
}