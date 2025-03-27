import { useState } from "react";
import { ButtonSubmit, InputsContainer, LoginContainer, Logo, MainContainer, Title } from "./styles"
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ButtonDefault } from "../../landingPage/components/ButtonDefault";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from "react-router";
import { login } from "../../services/apis/routes/auth.service";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const Authentication = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    interface LoginFormInputs {
        email: string;
        password: string;
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };


    const onSubmit = async (data: LoginFormInputs) => {
        try {
            await login(data.email, data.password);

            setLoginError(null);
            navigate('/inicio');
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                (error as { response?: { status?: number } }).response?.status === 401
            ) {
                setLoginError('Email ou senha incorretos');
            } else {
                setLoginError('Ocorreu um erro ao tentar fazer login');
            }
        }
    };

    return (
        <MainContainer>
            <LoginContainer>
                <Logo></Logo>
                <Title>Faça seu login</Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputsContainer>
                        <FormControl variant="outlined" error={!!errors.email}>
                            <InputLabel htmlFor="component-outlined">Email</InputLabel>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Email é obrigatório',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Informe um email inválido',
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
                        </FormControl>
                        <FormControl variant="outlined" error={!!errors.password}>
                            <InputLabel htmlFor="outlined-adornment-password">
                                Senha
                            </InputLabel>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Senha é obrigatória' }}
                                render={({ field }) => (
                                    <OutlinedInput
                                        {...field}
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Senha"
                                    />
                                )}
                            />

                            {errors.password && (
                                <FormHelperText sx={{ ml: 0 }}>
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                            {loginError && (
                                <FormHelperText sx={{ ml: 0 }} error={true}>
                                    {loginError}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </InputsContainer>
                    <ButtonSubmit>
                        <ButtonDefault
                            backgroundColor="branding-default-blue"
                            color="neutral-50"
                            icon={<ExitToAppIcon fontSize="small" />}
                            text="Login"
                        />
                    </ButtonSubmit>
                </form>
            </LoginContainer>
        </MainContainer>
    )
}