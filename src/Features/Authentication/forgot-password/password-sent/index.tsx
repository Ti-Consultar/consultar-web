import { InfoText, LoginContainer, MainContainer } from "../../styles"
import EmailSent from '../../../../assets/images/sent.png';
import { Subtitle } from "../../../../landingPage/components/AboutProduct/styles";
import { SentImg } from "./styles";
import { ButtonDefault } from "../../../../landingPage/components/ButtonDefault";
import { useNavigate } from "react-router";

export const PasswordSent = () => {
    const navigate = useNavigate();
    return (
        <MainContainer>
            <LoginContainer>
                <SentImg src={EmailSent} alt="Logo Consultar" />
                <Subtitle>Enviamos um e-mail com instruções para redefinir sua senha. Verifique sua caixa de entrada e, se necessário, o spam ou lixo eletrônico.</Subtitle>

                <ButtonDefault
                    backgroundColor="branding-default-blue"
                    color="neutral-50"
                    text="Voltar para o Login"
                    onClick={() => { navigate('/login') }}
                />

                <InfoText>Não recebeu o e-mail? Entre em contato com o suporte para obter ajuda</InfoText>
            </LoginContainer>
        </MainContainer>
    )
}