import { iconMap } from "./IconMap";

interface IconSwitcherProps {
  src: string;      // o ícone original importado
  active: boolean;
  size?: number;
}

export const IconSwitcher = ({ src, active, size = 22 }: IconSwitcherProps) => {
  // pega a chave do arquivo dentro do glob
  const originalKey = Object.keys(iconMap).find((key) =>
    iconMap[key] === src
  );

  if (!originalKey) {
    console.warn("IconSwitcher: original SVG não encontrado no iconMap", src);
    return <img src={src} width={size} height={size} />;
  }

  // monta o nome filled
  const filledKey = originalKey.replace(".svg", "-filled.svg");

  // checa se existe
  const finalSrc = active && iconMap[filledKey] ? iconMap[filledKey] : src;

  return <img src={finalSrc} width={size} height={size} />;
};
