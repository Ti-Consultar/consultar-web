import { ButtonHTMLAttributes } from "react";
import { Button } from "./styles";

interface ButtonDefaultProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  backgroundColor: string;
  color: string;
  text: string;
}

export const ButtonDefault: React.FC<ButtonDefaultProps> = ({
  icon,
  backgroundColor,
  color,
  text,
  ...props
}) => {
  return (
    <Button color={color} backgroundColor={backgroundColor} {...props}>
      {icon}
      {text}
    </Button>
  );
};
