import { ButtonContainer, ButtonStyle } from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    text: string;
}

export const Button = ({text, variant = 'primary', ...rest}: ButtonProps) => {
    return (
        <ButtonContainer>
            <ButtonStyle {...rest} variant={variant}>{text}</ButtonStyle>
        </ButtonContainer>
    );
}