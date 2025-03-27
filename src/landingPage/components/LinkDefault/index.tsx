import { Link } from "./styles";

interface LinkDefaultProps {
  color: string;
  fontSize: string;
  pathNavigate: string;
  text: string;
}

export const LinkDefault: React.FC<LinkDefaultProps> = ({
  color,
  fontSize,
  pathNavigate,
  text,
}) => {
  return (
    <Link color={color} to={pathNavigate} fontSize={fontSize}>
      {text}
    </Link>
  );
};
