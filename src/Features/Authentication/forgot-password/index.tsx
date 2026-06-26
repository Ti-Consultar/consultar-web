import {
  ButtonSubmit,
  Info,
  InfoText,
  InputsContainer,
  LoginContainer,
  LoginGrid,
  Logo,
  LogoWhite,
  MainContainer,
  SubTitle,
  Text,
  Title,
} from "../styles";
import LogoConsultarHorizontal from "../../../assets/images/logo-consultar-horizontal.svg";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ButtonDefault } from "../../../landingPage/components/ButtonDefault";
import { setNewPassword } from "../../../services/apis/routes/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PulseLoading } from "../../../components/PulseLoading";
import { TextCarousel } from "../../../components/TextCarousel";
import LogoConsultarWhite from "../../../assets/icons/consultar-white.svg";
import { ContentContainer } from "./styles";

const ForgotPassword = () => {
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
  const frasesDoLogin = [
    "Transforme dados em decisões.",
    "Conectando você à performance financeira.",
    "Controle total sobre suas unidades.",
  ];

  const onSubmit = async (data: EmailFormInput) => {
    setLoading(true);
    try {
      const response = await setNewPassword(data.email);
      if (!response.success) {
        setNewPasswordError(response.message || "Erro desconhecido.");
        return;
      }

      setNewPasswordError(null);
      navigate("/recuperar-senha/senha-enviada");
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        setNewPasswordError(
          "Erro ao buscar o e-mail, verifique se o e-mail foi escrito corretamente.",
        );
      } else {
        setNewPasswordError("Ocorreu um erro, tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PulseLoading size={100} />}
      <MainContainer>
        <LoginGrid>
          <ContentContainer>
            <div>
              <LogoWhite
                src={LogoConsultarWhite}
                alt="Logo Consultar"
              ></LogoWhite>
            </div>
            <Info>
              <Text>MRP Consultar</Text>
              <TextCarousel phrases={frasesDoLogin} intervalMs={5000} />
            </Info>
          </ContentContainer>
          <LoginContainer>
            <Logo src={LogoConsultarHorizontal} alt="Logo Consultar" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <InputsContainer>
                <Box>
                  <Title>Digite seu e-mail</Title>
                  <SubTitle>
                    Esse é o e-mail que você usa para fazer login.
                  </SubTitle>
                </Box>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="component-outlined">Email</InputLabel>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email é obrigatório",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Informe um email válido",
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
                <ButtonSubmit>
                  <ButtonDefault
                    backgroundColor="branding-default-blue"
                    color="neutral-50"
                    text="Próximo"
                  />
                </ButtonSubmit>
              </InputsContainer>

              <InfoText>
                Em caso de dúvidas, entre em contato com o suporte.
              </InfoText>
            </form>
          </LoginContainer>
        </LoginGrid>
      </MainContainer>
    </>
  );
};

export default ForgotPassword;
