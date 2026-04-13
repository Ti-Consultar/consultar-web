import * as S from "./styles";

interface Props {
  total: number;
  active: number;
  inactive: number;
}

export const GroupsKPI = ({ total, active, inactive }: Props) => {
  return (
    <S.DashContainer>
      <S.Card>
        <S.Label>Total de grupos</S.Label>
        <S.Value>{total}</S.Value>
      </S.Card>

      <S.Card>
        <S.Label>Grupos ativos</S.Label>
        <S.Value>{active}</S.Value>
      </S.Card>

      <S.Card>
        <S.Label>Grupos inativos</S.Label>
        <S.Value>{inactive}</S.Value>
      </S.Card>
    </S.DashContainer>
  );
};
