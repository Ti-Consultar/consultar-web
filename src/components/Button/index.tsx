import { ButtonContainer, ButtonStyle } from "./styles";

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'tertiary';
    text: string;
}

export const Button = ({text, variant = 'primary', ...rest}: ButtonProps) => {
    return (
        <ButtonContainer>
            <ButtonStyle {...rest} variant={variant}>{text}</ButtonStyle>
        </ButtonContainer>
    );
}