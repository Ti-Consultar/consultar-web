import { FilterType } from "../../../types/groupViewTypes";

export const filterGroups = ({
  groups,
  filter,
  search,
}: {
  groups: any[];
  filter: FilterType;
  search: string;
}) => {
  let result = groups;

  if (filter === "active") {
    result = result.filter((g) => !g.isDeleted);
  }

  if (filter === "inactive") {
    result = result.filter((g) => g.isDeleted);
  }

  if (search.trim()) {
    result = result.filter((g) =>
      (g.groupName || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  return result;
};
