import * as S from "./styles";

type DashCardProps = {
  label: string;
  value: number;
  subtitle?: string;
};

export function DashCard({ label, value }: DashCardProps) {
  return (
    <S.Card>
      <S.Label>{label}</S.Label>

      <S.Value>{value}</S.Value>
    </S.Card>
  );
}
