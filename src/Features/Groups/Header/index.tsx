import { useMemo } from "react";
import * as S from "./styles";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { FilterType, ViewMode } from "../../../types/groupViewTypes";

interface GroupsHeaderProps {
  total: number;
  activeCount: number;
  inactiveCount: number;

  viewMode: ViewMode;
  filter: FilterType;

  onSearchChange: (value: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onAddGroupClick: () => void;
}

export const GroupsHeader = ({
  total,
  activeCount,
  inactiveCount,
  viewMode,
  filter,
  onSearchChange,
  onFilterChange,
  onChangeViewMode,
  onAddGroupClick,
}: GroupsHeaderProps) => {
  const countLabel = useMemo(() => {
    switch (filter) {
      case "active":
        return `${activeCount} grupos ativos`;
      case "inactive":
        return `${inactiveCount} grupos inativos`;
      default:
        return `${total} grupos`;
    }
  }, [filter, total, activeCount, inactiveCount]);

  return (
    <S.Container>
      {/* LEFT */}
      <S.Left>
        <S.SearchWrapper>
          <SearchIcon fontSize="small" />
          <S.Input
            placeholder="Pesquisar grupos..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </S.SearchWrapper>

        <S.Filters>
          <S.FilterButton
            active={filter === "all"}
            onClick={() => onFilterChange("all")}
          >
            Todos
          </S.FilterButton>

          <S.FilterButton
            active={filter === "active"}
            onClick={() => onFilterChange("active")}
          >
            Ativos
          </S.FilterButton>

          <S.FilterButton
            active={filter === "inactive"}
            onClick={() => onFilterChange("inactive")}
          >
            Inativos
          </S.FilterButton>
        </S.Filters>
      </S.Left>

      {/* RIGHT */}
      <S.Right>
        <S.Count>{countLabel}</S.Count>

        <S.ViewSwitcher>
          <S.IconButton
            active={viewMode === "grid"}
            onClick={() => onChangeViewMode("grid")}
          >
            <ViewModuleIcon fontSize="small" />
          </S.IconButton>

          <S.IconButton
            active={viewMode === "table"}
            onClick={() => onChangeViewMode("table")}
          >
            <ViewListIcon fontSize="small" />
          </S.IconButton>
        </S.ViewSwitcher>

        <S.AddButton onClick={onAddGroupClick}>+ Adicionar grupo</S.AddButton>
      </S.Right>
    </S.Container>
  );
};
