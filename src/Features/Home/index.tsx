import { useEffect, useState } from "react";
import { MainTemplate } from "../../components/AppLayout"
import { MainContainer, Title } from "./styles"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface UserData {
    exp: number;
    iat: number;
    ip: string;
    role: string;
    unique_name: string;
}

export const MrpHome = () => {
    const [userData, setUserData] = useState<UserData | null | undefined>();

    useEffect(() => {
            const token = Cookies.get('token');
    
            if (token) {
                try {
                    const dataDecoded: UserData = jwtDecode(token);
                    setUserData(dataDecoded);
                    console.log(dataDecoded)
                } catch (error) {
                    console.error('Erro ao decodificar o token:', error);
                }
            } else {
                console.log('Couldn\'t find token');
            }
        }, []);

    return (
        <MainTemplate>
      {' '}
      <MainContainer>
        <Title>
          Bem-vindo, <span>{userData?.unique_name}</span>{' '}
        </Title>
      </MainContainer>{' '}
    </MainTemplate>
    )
}
