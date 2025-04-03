import { ButtonSubmit, InfoText, InputsContainer, LoginContainer, Logo, MainContainer, SubTitle, Title } from "../styles"
import LogoConsultarHorizontal from '../../../assets/images/logo-consultar-horizontal.svg';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ButtonDefault } from "../../../landingPage/components/ButtonDefault";
import { setNewPassword } from "../../../services/apis/routes/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PulseLoading } from "../../../components/PulseLoading";

export const ForgotPassword = () => {
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

    interface EmailFormInput {
        email: string;
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EmailFormInput>();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: EmailFormInput) => {
        setLoading(true);
        try {
            const response = await setNewPassword(data.email);
            if (!response.success) {
                setNewPasswordError(response.message || 'Erro desconhecido.');
                return;
            }

            setNewPasswordError(null);
            navigate('/recuperar-senha/senha-enviada');
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                (error as { response?: { status?: number } }).response?.status === 401
            ) {
                setNewPasswordError('Erro ao buscar o e-mail, verifique se o e-mail foi escrito corretamente.');
            } else {
                setNewPasswordError('Ocorreu um erro, tente novamente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <PulseLoading size={100} />}
            <MainContainer>
                <LoginContainer>
                    <Logo src={LogoConsultarHorizontal} alt="Logo Consultar" />
                    <Title>Digite seu e-mail</Title>
                    <SubTitle>Esse é o e-mail que você usa para fazer login.</SubTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputsContainer>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="component-outlined">Email</InputLabel>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Informe um email válido',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <OutlinedInput
                                            {...field}
                                            id="component-outlined"
                                            label="Email"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <FormHelperText sx={{ ml: 0 }}>
                                        {errors.email.message?.toString()}
                                    </FormHelperText>
                                )}
                                {newPasswordError && (
                                    <FormHelperText sx={{ ml: 0 }} error={true}>
                                        {newPasswordError}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </InputsContainer>
                        <ButtonSubmit>
                            <ButtonDefault
                                backgroundColor="branding-default-blue"
                                color="neutral-50"
                                text="Próximo"
                            />
                        </ButtonSubmit>
                        <InfoText>Em caso de dúvidas, entre em contato com o suporte.</InfoText>
                    </form>
                </LoginContainer>
            </MainContainer>
        </>
    )
}