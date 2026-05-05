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
    const query = search.toLowerCase();

    result = result.filter((g) => {
      const groupName = (g.groupName || "").toLowerCase();
      const fantasyName = (g.businessEntity?.nomeFantasia || "").toLowerCase();
      const corporateName = (g.businessEntity?.razaoSocial || "").toLowerCase();

      return (
        groupName.includes(query) ||
        fantasyName.includes(query) ||
        corporateName.includes(query)
      );
    });
  }

  return result;
};
