import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout"
import { MainContainer, SubTitle, Title } from "./styles"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { CompanyAccordion } from "../../components/CompanyAccordion";
import { getCompanies } from "../../services/apis/routes/companies.service";
import { useCompany } from "../../contexts/CompanyProvider";
import { useNavigate } from "react-router";
import { useLoading } from "../../contexts/LoadingProvider";
import { Button } from "../../components/Button";


interface UserData {
    exp: number;
    iat: number;
    ip: string;
    role: string;
    unique_name: string;
}

interface Company {
    companyId: number;
    companyName: string;
    dateCreate: string;
    subCompanies: any[];
    permission: {
        id: number;
        name: string;
    };
}

interface CompaniesResponse {
    userId: number;
    name: string;
    companies: Company[];
}

export const MrpHome = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [companyList, setCompanyList] = useState<CompaniesResponse | null>(null);
    const [, setError] = useState<string | null>(null);
    const { setCompanyId } = useCompany();
    const navigate = useNavigate();
    const { setLoading } = useLoading();

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const dataDecoded: UserData = jwtDecode(token);
                setUserData(dataDecoded);
            } catch (error) {
                navigate('/')
                console.log(error)
            }
        } else {
            navigate('/')
        }
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true, 'Carregando suas empresas');
            try {
                const response = await getCompanies();
                const data = response.data;

                setCompanyList(data);

                if (data.companies.length > 0) {
                    setCompanyId(data.companies[0].companyId);
                }
            } catch (error: unknown) {
                if (
                    error instanceof Error &&
                    (error as { response?: { status?: number } }).response?.status === 401
                ) {
                    setError(error.message);
                } else {
                    setError('Ocorreu um erro ao tentar fazer login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <MainTemplate>
            <MainContainer>
                <Title>
                    Bem-vindo, <span>{userData?.unique_name}</span>.
                </Title>
                <SubTitle>Acesse e administre suas empresas abaixo:</SubTitle>
                <Button text="Criar Grupo" variant="primary" />
            </MainContainer>
            {companyList?.companies.map(company => (
                <CompanyAccordion key={company.companyId} company={company} />
            ))}
        </MainTemplate>
    );
};
